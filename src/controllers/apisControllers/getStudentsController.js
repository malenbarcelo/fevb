const studentsQueries = require("../../dbQueries/students/studentsQueries")
const studentsExamsQueries = require("../../dbQueries/students/studentsExamsQueries")
const examsPracticalsQuestionsQueries = require("../../dbQueries/exams/examsPracticalsQuestionsQueries")

const getStudentsController = {
    students: async(req,res) =>{
        try{

            const { size, page, cuit, year_week, id_courses_types, order } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (cuit) {
                filters.cuit = cuit
            }

            if (year_week) {
                filters.year_week = JSON.parse(year_week)
            }

            if (id_courses_types) {
                filters.id_courses_types = JSON.parse(id_courses_types)
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            //get data
            const data = await studentsQueries.get({limit,offset,filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    studentsExams: async(req,res) =>{
        try{

            const { size, page, practicals_status, order } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (practicals_status) {
                filters.practicals_status = JSON.parse(practicals_status)
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            const data = await studentsExamsQueries.get({limit,offset,filters })

            // add status
            data.rows.forEach(row => {
                const missing = row.student_data.attendance.filter( a => a.attended == 0)
                const amountPaid = row.student_data.payments.reduce((acc, obj) => acc + Number(obj.amount), 0)
                row.attendance = missing.length > 0 ? 'incomplete' : 'complete'
                row.payment = Number(row.student_data.price) > amountPaid ? 'incomplete' : 'complete'
                row.status = row.payment == 'incomplete' ? 'Pago incompleto' : (row.attendance == 'incomplete' ? 'Curso incompleto' : (row.theoricals_status != 'passed' ? 'Teórico incompleto' : 'Habilitado' ))
                
            })

            // add exams versions
            for (let i = 0; i < data.rows.length; i++) {
                const lastPracticalVersion = await examsPracticalsQuestionsQueries.getLastVersion(data.rows[i].id_exams_practicals)
                data.rows[i].lastPracticalVersion = lastPracticalVersion ? lastPracticalVersion.exam_practical_version : null
            }

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getStudentsController

