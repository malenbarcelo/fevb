
import g from "./globals.js"
import { domain } from "../../../domain.js"
import { gf } from "../../../globalFunctions.js"

// complete exam (CEPP)
async function ceppEventListeners() {

    // send results
    ceppSend.addEventListener('click',async()=>{

        ceppLoader.style.display = 'block'

        /// validations
        let errors = 0
        
        // sworn declaration
        const sd = document.getElementById('ceppSdAccept')
        if (!sd.checked) {
            errors += 1
            ceppStageSwornDeclaration.classList.add('stage-container-error')
        }else{
            ceppStageSwornDeclaration.classList.remove('stage-container-error')
        }

        // teachers
        const selectedTeacher = g.teachersInputs.find( ti => ti.checked)
        if (!selectedTeacher) {
            errors += 1
            ceppStageTeachers.classList.add('stage-container-error')
        }else{
            ceppStageTeachers.classList.remove('stage-container-error')
        }

        // questions
        const stagesWithErrors = g.stagesContainers.filter( sc => sc.id.includes('ceppStage_'))
        const incompleteQuestions = g.questionsInputsNames.some(name => {
            return !document.querySelector(`input[name="${name}"]:checked`)
        })
        if (incompleteQuestions) {
            errors +=1
            stagesWithErrors.forEach(s => s.classList.add('stage-container-error'))
        }else{
            stagesWithErrors.forEach(s => s.classList.remove('stage-container-error'))
        }

        // results
        const incompleteResults = g.resultsInputsNames.some(name => {
            return !document.querySelector(`input[name="${name}"]:checked`)
        })
        if (incompleteResults) {
            errors +=1
            ceppStageResults.classList.add('stage-container-error')
        }else{
            ceppStageResults.classList.remove('stage-container-error')
        }

        if (errors > 0) {
            ceppError.classList.remove('not-visible')
            ceppContent.scrollTop = 0
            ceppLoader.style.display = 'none'
            
        }else{

            let createdData
            let createAnswers
            let createDetails
            let createObservations
            let updateStudentsExams

            // teacher
            const selectedTeacher = g.teachersInputs.find( i => i.checked)
            g.studentsPracticalsAnswers.id_teachers = Number(selectedTeacher.id.split('_')[1])
            
            // status
            const notPassedInputs = Array.from(document.querySelectorAll('input[id^="ceppResults_notPassed"]'))
            const notPassedChecked = notPassedInputs.find(i => i.checked)
            g.studentsPracticalsAnswers.status = notPassedChecked ? 'not-passed' : 'passed'

            // students practicals answers
            const response1 = await fetch(domain + 'create/students/practicals-answers',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify([g.studentsPracticalsAnswers])
            })

            createAnswers = await response1.json()

            // students practicals answers details
            if (createAnswers.response == 'ok') {
                const details = []
                createdData = createAnswers.data[0]
                const questionsInputs = Array.from(document.querySelectorAll('input[id^="ceppOption_"]'))
                const checkedInputs = questionsInputs.filter( i => i.checked)
                const checkedInputsIds = checkedInputs.map( i => i.id)

                checkedInputsIds.forEach(input => {
                    details.push({
                        id_students_exams: createdData.id_students_exams,
                        id_students_practicals_answers: createdData.id,
                        id_students: createdData.id_students,
                        id_exams_practicals: createdData.id_exams_practicals,
                        id_exams_practicals_questions: Number(input.split('_')[1]),
                        id_selected_option: Number(input.split('_')[2])
                    })
                })

                const response2 = await fetch(domain + 'create/students/practicals-answers-details',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(details)
                })

                createDetails = await response2.json()

                // students practicals answers observations
                if (createDetails.response == 'ok') {
                    
                    // stages observations
                    let obs = Array.from(document.querySelectorAll('input[id^="ceppObsStage_"]'))
                        .map(i => ({
                            id_students_exams: createdData.id_students_exams,
                            id_students_practicals_answers: createdData.id,
                            observation_type: 'stage',
                            stage_number: Number(i.id.split('_')[1]),
                            observation: i.value
                        })
                    )

                    // results observations
                    obs.push({
                        id_students_exams: createdData.id_students_exams,
                        id_students_practicals_answers: createdData.id,
                        observation_type: 'result',
                        observation: ceppObsResults.value
                    })

                    const response3 = await fetch(domain + 'create/students/practicals-answers-observations',{
                        method:'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(obs)
                    })

                    createObservations = await response3.json()

                    // update students exams
                    if (createObservations.response == 'ok') {

                        const dataToUpdate = [{
                            id: createdData.id_students_exams,
                            dataToUpdate:{
                                id_students_practicals_answers: createdData.id,
                                practicals_status: createdData.status
                            }
                        }]

                        const response4 = await fetch(domain + 'update/students/exams',{
                            method:'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(dataToUpdate)
                        })

                        updateStudentsExams = await response4.json()
                        
                    }
                }
            }

            cepp.style.display = 'none'
            ceppLoader.style.display = 'none'

            if (createAnswers.response == 'ok' && createDetails.response == 'ok' && createObservations.response == 'ok' && updateStudentsExams.response == 'ok') {
                okText.innerText = 'Examen guardado con éxito'
                gf.showResultPopup(okPopup)
            }else{
                errorText.innerText = 'Error al guardar el examen'
                gf.showResultPopup(errorPopup)
            }
                
            // f.resetData()

        }
    })

}

export {ceppEventListeners}