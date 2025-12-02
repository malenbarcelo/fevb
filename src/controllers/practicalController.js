const examsPracticalsTeachersQueries = require("../dbQueries/exams/examsPracticalsTeachersQueries.js")

const practicalControllers = {
    // complete practical
    completePractical: async(req,res) => {
        try{

            const teachers = await examsPracticalsTeachersQueries.get({filters:{}})

            return res.render('exams/practicals/pendingExams',{title:'FEVB - Exámenes', teachers})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = practicalControllers

