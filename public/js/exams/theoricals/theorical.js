import g from "./globals.js"
import { utils } from "./utils.js"
import { domain } from "../../domain.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.sessionData = await (await fetch(`${domain}composed/get-session-data`)).json()
    const answers = await (await fetch(`${domain}get/students-exams-theoricals-answers?id_students_exams=${g.sessionData.studentExam.id}`)).json()
    g.answers = answers.rows
    g.questions = await (await fetch(`${domain}get/exams-theoricals-questions?order=[["id","ASC"]]`)).json()
    
    // update question
    utils.updateQuestion()

    // continue button
    continueBtn.addEventListener('click',async()=>{

        loader.style.display = 'block'

        const checkedOptions = [...g.questionOptions].filter(qo => qo.checked)

        if (checkedOptions.length == 0) {
            error.classList.remove('not-visible')
            loader.style.display = 'none'
        }else{
            
            if (g.questionNumber < g.questions.length) g.questionNumber++
            
            error.classList.add('not-visible')

            // save answer
            const selectedOptions = checkedOptions.map(ch => ch.id)
            const mapSelectedOptions = selectedOptions.map( so => so.split('_')[1]).join(',')
            
            const data = {
                condition: 'id',
                data: [{
                    id:g.answers.find( a => a.id_exams_theoricals_questions == g.questionData.id).id,
                    dataToUpdate: {
                        ids_selected_options: mapSelectedOptions,
                        date: new Date()
                    }
                }]
            }

            const response = await fetch(domain + 'update/students-exams-theoricals-answers',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            if (responseData.response == 'ok') {

                // update students exams if question_number = 1
                if (g.questionNumber == 2) {

                    const data = [{
                            id: g.sessionData.studentExam.id,
                            dataToUpdate: {
                                theorical_status: 'in-progress',
                                theorical_grade: null,
                                theorical_date: null
                            }
                    }]

                    await fetch(domain + 'update/students/exams',{
                        method:'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    })
                }

                // update g.lasAttempt
                const answer = g.answers.find( a => a.id_exams_theoricals_questions == g.questionData.id)
                answer.ids_selected_options = mapSelectedOptions
                
                if (g.buttonAction == 'continue') {
                    // get next question
                    utils.updateQuestion()
                }else{
                    window.location.href = '/examenes/resultado'
                }

                loader.style.display = 'none'
                
            }else{
                console.log('error')
            }
        }
    })
    
    // back button
    backBtn.addEventListener('click',async()=>{
        if (g.questionNumber > 1) g.questionNumber--
        utils.updateQuestion()
    })
    


    loader.style.display = 'none'

    

})