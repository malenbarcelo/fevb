import g from "./globals.js"
import { f } from "./functions.js"
import { domain } from "../../domain.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    const sessionData = await (await fetch(`${domain}composed/get-session-data`)).json()
    g.lastAnswer = sessionData.lastAnswer
    g.lastAnswerDetails = sessionData.lastAnswerDetails
    g.questions = await (await fetch(`${domain}get/exams/questions?order:[["question_number","ASC"]]`)).json()
    g.examImages = await (await fetch(`${domain}composed/get-exam-images`)).json()

    // update question
    f.updateQuestion()

    // continue button
    continueBtn.addEventListener('click',async()=>{

        const checkedOptions = [...g.questionOptions].filter(qo => qo.checked)

        if (checkedOptions.length == 0) {
            error.classList.remove('not-visible')
        }else{
            
            if (g.questionNumber < g.questions.length) g.questionNumber++
            
            error.classList.add('not-visible')

            // save answer
            const selectedOptions = checkedOptions.map(ch => ch.id)
            const mapSelectedOptions = selectedOptions.map( so => so.split('_')[1]).join(',')
            
            const data = [{
                id: g.lastAnswerDetails.find( a => a.id_exams_questions == g.questionData.id).id,
                idQuestions: g.questionData.id,
                dataToUpdate: {
                    ids_selected_options: mapSelectedOptions
                }
            }]

            const response = await fetch(domain + 'update/students-answers-details',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            if (responseData.response == 'ok') {

                // update g.lasAttempt
                const answer = g.lastAnswerDetails.find( a => a.id_exams_questions == g.questionData.id)
                answer.ids_selected_options = mapSelectedOptions
                
                if (g.buttonAction == 'continue') {
                    // get next question
                    f.updateQuestion()
                }else{
                    window.location.href = '/examenes/resultado'
                }
                
            }else{
                console.log('error')
            }
        }
    })
    
    // back button
    backBtn.addEventListener('click',async()=>{
        if (g.questionNumber > 1) g.questionNumber--
        f.updateQuestion()
    })
    


    loader.style.display = 'none'

    

})