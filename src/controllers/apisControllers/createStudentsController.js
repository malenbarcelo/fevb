const studentsPracticalsAnswersQueries = require("../../dbQueries/students/studentsPracticalsAnswersQueries")
const studentsPracticalsAnswersDetailsQueries = require("../../dbQueries/students/studentsPracticalsAnswersDetailsQueries")
const studentsPracticalsAnswersObservationsQueries = require("../../dbQueries/students/studentsPracticalsAnswersObservationsQueries")
const examsPracticalsOptionsQueries = require("../../dbQueries/exams/examsPracticalsOptionsQueries")

const createStudentsController = {
    practicalsAnswers: async(req,res) =>{
        try{

            const data = req.body

            const createdData = await studentsPracticalsAnswersQueries.create(data)

            res.status(200).json({response:'ok', data: createdData})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },
    practicalsAnswersDetails: async(req,res) =>{
        try{

            let data = req.body
            const idQuestions = data.map(d => d.id_exams_practicals_questions)
            const optionsData = await examsPracticalsOptionsQueries.get({filters:{id_exams_practicals_questions:idQuestions}})

            // complete data
            data.forEach(d => {
                const correctOption = optionsData.find( o => o.id_exams_practicals_questions == d.id_exams_practicals_questions && o.correct_option == 1)
                d.id_correct_option = correctOption.id
                d.correct_answer = correctOption.id == d.id_selected_option ? 1 : 0
                
            })

            // create data
            await studentsPracticalsAnswersDetailsQueries.create(data)

            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },
    practicalsAnswersObservations: async(req,res) =>{
        try{

            const data = req.body

            await studentsPracticalsAnswersObservationsQueries.create(data)

            res.status(200).json({response:'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    },
}
module.exports = createStudentsController

