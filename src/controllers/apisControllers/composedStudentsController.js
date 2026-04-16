const cronController = require('../cronController')
const studentsPaymentsQueries = require('../../dbQueries/students/studentsPaymentsQueries')
const studentsQueries = require('../../dbQueries/students/studentsQueries')

const studentsController = {
    updatePaymentsAndAttendance: async(req,res) =>{
        try{

            await cronController.updateStudents()

            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({error:error})
        }
    },
    processStudentsPayments: async(req,res) =>{
        try{

            const data = req.body

            // create payments
            let createdData = await studentsPaymentsQueries.create(data)
            createdData = createdData.map( d => d.get({plain:true}))

            // update students 
            const idStudents = createdData.map( d => d.id_students)
            const studentsData = await studentsQueries.getPrice(idStudents)

            const studentsToUpdate = studentsData.map(s => {
                const totalPaid = s.payments.reduce((acc, p) => acc + Number(p.amount), 0)
                return {
                    id: s.id,
                    dataToUpdate: {
                        payment_status: totalPaid >= Number(s.price) ? 'complete' : 'incomplete'
                    }
                }
            })

            await studentsQueries.update('id', studentsToUpdate)

            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({error:error})
        }
    },
    deleteStudentsPayments: async(req,res) =>{
        try{

            const condition = req.body.condition
            const data = req.body.data

            // delete payments
            await studentsPaymentsQueries.destroy(condition,data)

            // update students 
            let studentsToUpdate = []
            data.forEach(element => {
                studentsToUpdate.push({
                    id: element,
                    dataToUpdate: {
                        payment_status: 'incomplete'
                    }
                })
            })

            await studentsQueries.update('id', studentsToUpdate)

            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({error:error})
        }
    },

    
}
module.exports = studentsController

