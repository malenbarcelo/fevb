const examsQuestionsQueries = require("../../dbQueries/exams/examsQuestionsQueries")

const getExamsController = {
    examsQuestions: async(req,res) =>{
        try{

            const { order, show_correct_answer } = req.query
            
            const filters = {}
            
            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data if student logged
            filters.id_exams = req.session.studentLogged.examData.id
            filters.exam_variant = req.session.studentLogged.lastAnswer.exam_variant
            filters.exam_version = req.session.studentLogged.lastAnswer.exam_version

            // get data
            let data = await examsQuestionsQueries.get({ filters })

            // filter correct answer if !show_correct_answer --> to hide answers in front end
            if (!show_correct_answer) {
                data.forEach(d => {
                    d.question_options.forEach(o => {
                        delete o.correct_option
                    })
                })
            }

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error: error})
        }
    },
}
module.exports = getExamsController

