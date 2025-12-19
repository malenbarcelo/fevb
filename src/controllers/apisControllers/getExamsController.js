const examsTheoricalsQuestionsQueries = require("../../dbQueries/exams/examsTheoricalsQuestionsQueries")
const examsPracticalsQuestionsQueries = require("../../dbQueries/exams/examsPracticalsQuestionsQueries")

const getExamsController = {
    examsTheoricalsQuestions: async(req,res) =>{
        try{

            const { order, show_correct_answer } = req.query
            
            const filters = {}
            
            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data if student logged
            filters.id_exams_theoricals = req.session.studentLogged.studentExam.id_exams_theoricals
            filters.exam_theorical_variant = req.session.studentLogged.lastAnswer.exam_theorical_variant
            filters.exam_theorical_version = req.session.studentLogged.lastAnswer.exam_thoerical_version

            // get data
            let data = await examsTheoricalsQuestionsQueries.get({ filters })

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
    examsPracticalsQuestions: async(req,res) =>{
        try{

            const { order, id_exams_practicals, exam_practical_version} = req.query
            
            const filters = {}
            
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id_exams_practicals) {
                filters.id_exams_practicals = JSON.parse(id_exams_practicals)
            }

            if (exam_practical_version) {
                filters.exam_practical_version = JSON.parse(exam_practical_version)
            }

            // get data
            let data = await examsPracticalsQuestionsQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error: error})
        }
    },
}
module.exports = getExamsController

