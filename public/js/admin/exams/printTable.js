import g from "./globals.js"
import gg from "../../globals.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.studentsCoursesExams

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-5-0 body-even' : 'body pad-5-0 body-odd'
        
        // theorical data
        const theoricalIcon = element.course_data.id_exams_theoricals == null ? '--' : (element.exams_results.theorical_status == 'passed' ? '<i class="fa-solid fa-check fc-green fs-14"></i>' : ((element.exams_results.theorical_status == 'pending' || element.exams_results.theorical_status == 'in-progress') ? '<i class="fa-solid fa-xmark fc-gray fs-14"></i>' : '<i class="fa-solid fa-xmark fc-error fs-14"></i>'))
        
        const theoricalDateArray = element.exams_results.theorical_date == null ? null : element.exams_results.theorical_date.split('-')
        const theoricalDate =  element.course_data.id_exams_theoricals == null ? '--' : (theoricalDateArray == null ? '' : `${theoricalDateArray[2]}/${theoricalDateArray[1]}/${theoricalDateArray[0]}`)

        // practical data
        const practicalIcon = element.course_data.id_exams_practicals == null ? '--' : (element.exams_results.practical_status == 'passed' ? '<i class="fa-solid fa-check fc-green fs-14"></i>' : (element.exams_results.practical_status == 'pending' ? '<i class="fa-solid fa-xmark fc-gray fs-14"></i>' : '<i class="fa-solid fa-xmark fc-error fs-14"></i>'))

        const practicalDateArray = element.exams_results.practical_date == null ? null : element.exams_results.practical_date.split('-')
        const practicalDate =  practicalDateArray == null ? '' : `${practicalDateArray[2]}/${practicalDateArray[1]}/${practicalDateArray[0]}`
        
        const examPractical = element.course_data.id_exams_practicals == null ? '--' : element.exams_results.exam_practical_data.exam_alias

        console.log(element)
        
        // status
        let statusHtml = '<div class="fs-13 fw-b flex-r jc-c cg-3 ai-c">'
        statusHtml += element.exams_results.payment == 'complete' ? '<div class="fc-green">$</div>' : '<div class="fc-error">$</div>'
        statusHtml += '<div class="fc-gray">|</div>'
        statusHtml += element.exams_results.attendance == 'complete' ? '<div class="fc-green">C</div>' : '<div class="fc-error">C</div>'        
        statusHtml += '<div class="fc-gray">|</div>'
        statusHtml += element.exams_results.theorical_status == 'passed' ? '<div class="fc-green">T</div>' : '<div class="fc-error">T</div>'
        statusHtml += '<div class="fc-gray">|</div>'
        statusHtml += element.course_data.id_exams_practicals == null ? '<div class="fc-gray">P</div>' : (element.exams_results.practical_status == 'passed' ? '<div class="fc-green">P</div>' : '<div class="fc-error">P</div>')
        statusHtml += '</div>'

        // repre
        const repreStatus = (element.course_data.repre_course_code != null && element.exams_results.theorical_status == 'passed' && (element.exams_results.practical_status == null || element.exams_results.practical_status == 'passed')) ? true : false
        const repreCheck = element.uploaded_repre == 1 ? 'checked' : ''

        // date
        const date = g.dates.find( d => d.year_week == element.student_data.year_week)
        const dateString = date.date_string + '/' + date.year

        html += `
            <tr class="" id="tr_${element.id}">
                <td class="${rowClass}">${ element.id_students }</td>
                <td class="${rowClass}">${ element.student_data.cuit_cuil }</td>
                <td class="${rowClass}">${ element.student_data.first_name + ' ' + element.student_data.last_name }</td>
                <td class="${rowClass}">${ element.course_data.course_summary }</td>
                <td class="${rowClass}">${ dateString }</td>
                <td class="${rowClass}">${ element.exams_results.exam_theorical_data == null ? '--' : element.exams_results.exam_theorical_data.exam_alias }</td>
                <td class="${rowClass}">${ theoricalIcon }</td>
                <td class="${rowClass}">${ theoricalDate }</td>
                <td class="${rowClass}">${ examPractical }</td>
                <td class="${rowClass}">${ practicalIcon }</td>
                <td class="${rowClass}">${ examPractical == '--' ? '--' : practicalDate }</td>
                <td class="${rowClass}">${ statusHtml }</td>                
                <td class="${rowClass}">${ repreStatus ? `<input type="checkbox" id="check_${element.id}" ${repreCheck}></td>` : ''}
                
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)

}

function eventListeners(data) {

    data.forEach(element => {

        const check = document.getElementById('check_' + element.id)

        // check
        if (check) {
            check.addEventListener('click',async(e)=>{

                e.preventDefault()

                const text = check.checked ? "Subido a REPRE" : "No subido a REPRE"
                g.action = 'checkRepre'
                g.repre = check.checked ? 1 : 0
                g.elementToUpdate = element
                const student = (element.student_data.first_name + ' ' + element.student_data.last_name).toLocaleUpperCase()

                coppText.innerHTML = `¿Confirma que desea marcar como <b><i>"${text}"</i></b>? <br><b>Alumno:</b> ${student}</b><br><b>Curso:</b> ${element.course_data.course_summary}`

                copp.style.display = 'block'

            })
        }
    })
}

export { printTable }