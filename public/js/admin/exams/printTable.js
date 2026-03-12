import g from "./globals.js"
import gg from "../../globals.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.studentsCoursesExams

    console.log(data)

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-5-0 body-even' : 'body pad-5-0 body-odd'
        const grade = element.exams_results.grade ? (gg.formatter1.format(element.exams_results.grade * 100) + '%') : ''
        const gradeCss = element.exams_results.theorical_status == 'passed' ? 'fw-b fc-green' : 'fw-b fc-error'
        const status = element.exams_results.payment == 'incomplete' ? 'Pago ?' : (element.exams_results.attendance == 'incomplete' ? 'Asistencia ?' : 'ver')
        // const dateArray = element.inscription_date.split('-')        
        // const inscDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
        // const checkInput = element.payment_status == 'complete' ? 'checked' : ''

        html += `
            <tr class="" id="tr_${element.id}">
                <td class="${rowClass}">${element.id_students}</td>
                <td class="${rowClass}">${element.student_data.cuit_cuil}</td>
                <td class="${rowClass}">${element.student_data.first_name + ' ' + element.student_data.last_name}</td>
                <td class="${rowClass}">${element.course_data.type_alias + ': ' + element.course_data.category }</td>
                <td class="${rowClass}">${element.exams_results.exam_theorical_data.exam_alias }</td>
                <td class="${rowClass + ' ' + gradeCss}">${ grade }</td>
                <td class="${rowClass}">${ '' }</td>
                <td class="${rowClass}">${ '' }</td>
                <td class="${rowClass}">${ '' }</td>
                <td class="${rowClass}">${ '' }</td>
                <td class="${rowClass}">${ status }</td>
                
                <td class="${rowClass}"><input type="checkbox" id="check_${element.id}"></td>
                
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