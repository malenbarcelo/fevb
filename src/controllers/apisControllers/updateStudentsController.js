const studentsTheoricalsAnswersDetailsQueries = require("../../dbQueries/students/studentsTheoricalsAnswersDetailsQueries")
const examsTheoricalsQuestionsQueries = require("../../dbQueries/exams/examsTheoricalsQuestionsQueries")
const studentsExamsQueries = require("../../dbQueries/students/studentsExamsQueries");
const studentsQueries = require("../../dbQueries/students/studentsQueries");
const gf = require("../../utils/generalFunctions");

const updateStudentsController = {
    students: async(req,res) =>{
        try{

            let data = req.body

            await studentsQueries.update(data.condition,data.data)

            res.status(200).json({response: 'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response: 'error', error: error})
        }
    },
    studentsAnswersDetails: async(req,res) =>{
        try{

            let data = req.body

            for (let i = 0; i < data.length; i++) {
                
                const questionsData = await examsTheoricalsQuestionsQueries.get({filters:{id:data[i].idQuestions}})
                
                const correctOptions = questionsData[0].question_options
                    .filter(item => item.correct_option == 1)
                    .map(item => item.id)

                let selectedOptions = data[i].dataToUpdate.ids_selected_options.split(',')
                selectedOptions = selectedOptions.map( so => Number(so))

                const compareOptions = gf.compareArrays(correctOptions,selectedOptions)

                data[i].dataToUpdate.correct_answer = compareOptions ? 1 : 0
                
            }
            
            await studentsTheoricalsAnswersDetailsQueries.update('id',data)

            res.status(200).json({response: 'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response: 'error', error: error})
        }
    },
    studentsExams: async(req,res) =>{
        try{

            let data = req.body

            await studentsExamsQueries.update('id',data)

            res.status(200).json({response: 'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response: 'error', error: error})
        }
    },
    studentsPayments: async(req,res) =>{
        try{

            let data = req.body

            await studentsQueries.update(data.condition,data.data)

            res.status(200).json({response: 'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response: 'error', error: error})
        }
    },
}
module.exports = updateStudentsController

