const cronController = require('../cronController')

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

    
}
module.exports = studentsController

