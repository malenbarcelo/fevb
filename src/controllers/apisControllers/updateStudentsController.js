const studentsAnswersDetailsQueries = require("../../dbQueries/students/studentsAnswersDetailsQueries")
const examsQuestionsQueries = require("../../dbQueries/exams/examsQuestionsQueries");
const gf = require("../../functions/generalFunctions");
const { compare } = require("bcryptjs");


const updateStudentsController = {
    studentsAnswersDetails: async(req,res) =>{
        try{

            let data = req.body

            for (let i = 0; i < data.length; i++) {
                
                const questionsData = await examsQuestionsQueries.get({filters:{id:data[i].idQuestions}})
                
                const correctOptions = questionsData[0].question_options
                    .filter(item => item.correct_option == 1)
                    .map(item => item.id)

                let selectedOptions = data[i].dataToUpdate.ids_selected_options.split(',')
                selectedOptions = selectedOptions.map( so => Number(so))

                const compareOptions = gf.compareArrays(correctOptions,selectedOptions)

                data[i].dataToUpdate.correct_answer = compareOptions ? 1 : 0
                
            }
            
            await studentsAnswersDetailsQueries.update('id',data)

            res.status(200).json({response: 'ok'})

        }catch(error){
            console.log(error)
            res.status(200).json({response: 'error', error: error})
        }
    },
}
module.exports = updateStudentsController

