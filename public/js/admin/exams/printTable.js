import g from "./globals.js"
import gg from "../../globals.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.studentsCoursesExams

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-5-0 body-even' : 'body pad-5-0 body-odd'
        
        // theorical data
        const theoricalIcon = element.exams_results.theorical_status == 'passed' ? '<i class="fa-solid fa-check fc-green fs-14"></i>' : (element.exams_results.theorical_status == 'pending' ? '<i class="fa-solid fa-xmark fc-gray fs-14"></i>' : '<i class="fa-solid fa-xmark fc-error fs-14"></i>')
        
        const theoricalDateArray = element.exams_results.theorical_date == null ? null : element.exams_results.theorical_date.split('-')
        const theoricalDate =  theoricalDateArray == null ? '' : `${theoricalDateArray[2]}/${theoricalDateArray[1]}/${theoricalDateArray[0]}`

        // practical data
        const practicalIcon = element.course_data.id_exams_practicals == null ? '<i class="fa-solid fa-minus fs-13 fc-gray"></i>' : (element.exams_results.practical_status == 'passed' ? '<i class="fa-solid fa-check fc-green fs-14"></i>' : (element.exams_results.practical_status == 'pending' ? '<i class="fa-solid fa-xmark fc-gray fs-14"></i>' : '<i class="fa-solid fa-xmark fc-error fs-14"></i>'))

        const practicalDateArray = element.exams_results.practical_date == null ? null : element.exams_results.practical_date.split('-')
        const practicalDate =  practicalDateArray == null ? '' : `${practicalDateArray[2]}/${practicalDateArray[1]}/${practicalDateArray[0]}`

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

        html += `
            <tr class="" id="tr_${element.id}">
                <td class="${rowClass}">${element.id_students}</td>
                <td class="${rowClass}">${element.student_data.cuit_cuil}</td>
                <td class="${rowClass}">${element.student_data.first_name + ' ' + element.student_data.last_name}</td>
                <td class="${rowClass}">${element.course_data.type_alias + ': ' + element.course_data.category }</td>
                <td class="${rowClass}">${element.exams_results.exam_theorical_data.exam_alias }</td>
                <td class="${rowClass}">${ theoricalIcon }</td>
                <td class="${rowClass}">${ theoricalDate }</td>
                <td class="${rowClass}">${ practicalIcon }</td>
                <td class="${rowClass}">${ practicalDate }</td>
                <td class="${rowClass}">${ statusHtml }</td>                
                <td class="${rowClass}">${ repreStatus ? `<input type="checkbox" id="check_${element.id}" ${repreCheck}></td>` : ''}
                
            </tr>
            `
    })

    body.innerHTML = html

    //eventListeners(data)

}

function eventListeners(data) {

    data.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const destroy = document.getElementById('destroy_' + element.id)
        const payment = document.getElementById('payment_' + element.id)            
        const tr = document.getElementById('tr_' + element.id)

        // edit
        edit.addEventListener('click',async()=>{
        })

        // edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        // destroy
        destroy.addEventListener('click', async()=>{
            
            loader.style.display = 'block'

            g.elementToDestroy = element

            g.action = 'destroyElement'
                
            coppText.innerHTML = '¿Confirma que desea eliminar al alumno <b>' + element.first_name + ' ' + element.last_name + '</b>?'
                
            copp.style.display = 'block'                    
            
            loader.style.display = 'none'
            
        })

        // payment
        payment.addEventListener('click', async()=>{
            
            loader.style.display = 'block'

            if (payment.checked) {

                payment.checked = false

                g.paymentToCheck = payment

                g.elementsToCreate.push({id_students: element.id, amount: Number(element.price)})

                g.action = 'createPayment'
                
                coppText.innerHTML = '¿Confirma el pago de <b>' + element.first_name + ' ' + element.last_name + '</b> por un importe de <b> $' + gg.formatter0.format(Number(element.price)) + '</b>?'
                
                copp.style.display = 'block'                    
                    
            }else{
                payment.checked = true
            }

            loader.style.display = 'none'
            
        })
    })
}

export { printTable }