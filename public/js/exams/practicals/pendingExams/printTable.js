import g from "./globals.js"
import { f } from "./functions.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.pendingExams

    console.log(data)

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-7-0 body-even' : 'body pad-7-0 body-odd'
        const paymentIcon = element.payment == 'complete' ? '<i class="fa-solid fa-check fc-green"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>'
        const attendanceIcon = element.attendance == 'complete' ? '<i class="fa-solid fa-check fc-green"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>'
        const theoricalIcon = element.theoricals_status == 'passed' ? '<i class="fa-solid fa-check fc-green"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>'
        
        html += `
            <tr class="pointer" id="tr_${element.id}">
                <td class="${rowClass}">${element.id_students}</td>
                <td class="${rowClass}">${element.exam_practical_data.courses_types_alias}</td>
                <td class="${rowClass}">${element.exam_practical_data.exam_name}</td>
                <td class="${rowClass}">${element.student_data.attendance[0].week_number}</td>
                <td class="${rowClass}">${element.student_data.attendance[0].date_string + '/' + element.student_data.attendance[0].year}</td>
                <td class="${rowClass}">${element.student_data.name}</td>
                <td class="${rowClass}">${element.student_data.cuit}</td>
                <td class="${rowClass}">${paymentIcon}</td>
                <td class="${rowClass}">${attendanceIcon}</td>
                <td class="${rowClass}">${theoricalIcon}</td>
                <td class="${rowClass}"><i class="fa-solid fa-file-pen allowed-icon" id="complete_${element.id}"></i></td>
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)
}

function eventListeners(data) {

    data.forEach(element => {

        const complete = document.getElementById('complete_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        // complete
        complete.addEventListener('click',async()=>{

            // get questions
            await f.getExamQuestions(element.id_exams_practicals)
            f.printExamQuestions()
            f.printExamResults()            
            
            // complete titles
            ceppSubtitle.innerText = element.exam_practical_data.exam_name
            ceppName.innerText = element.student_data.name.toUpperCase()
            ceppCuit.innerText = 'CUIT: ' + element.student_data.cuit
            ceppError.classList.add('not-visible')

            // get stages containers
            g.examQuestions.forEach(stage => {
                const newElement = document.getElementById('ceppStage_' + stage.stage_number)
                g.stagesContainers.push(newElement)
            })

            // hide errors
            ceppError.classList.add('not-visible')
            g.stagesContainers.forEach(sc => sc.classList.remove('stage-container-error'))

            // get teachers inputs
            g.teachersInputs = Array.from(document.querySelectorAll('input[name="teacher"]'))

            // get stages inputs
            const questionsInputsIds = document.querySelectorAll('input[id^="ceppOption_"]')
            g.questionsInputsNames = [...new Set([...questionsInputsIds].map(r => r.name))]

            // get results inputs
            const resultsInputsIds = document.querySelectorAll('input[id^="ceppResults_"]')
            g.resultsInputsNames = [...new Set([...resultsInputsIds].map(r => r.name))]

            // update data to save
            g.studentsPracticalsAnswers = {}
            g.studentsPracticalsAnswers.id_students_exams = element.id
            g.studentsPracticalsAnswers.id_students = element.id_students
            g.studentsPracticalsAnswers.id_exams_practicals = element.id_exams_practicals
            g.studentsPracticalsAnswers.exam_practical_version = element.practicals_answers.length == 0 ? element.lastPracticalVersion : element.practicals_answers[0].exam_practical_version

            cepp.style.display = 'block'
            ceppContent.scrollTop = 0
                
        })

        // edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (complete) {
                complete.click()
            }
        })
    })
}

export { printTable }