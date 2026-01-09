import g from "./globals.js"
import gg from "../../globals.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.students

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-5-0 body-even' : 'body pad-5-0 body-odd'
        const dateArray = element.inscription_date.split('-')        
        const inscDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
        const checkInput = element.paymentStatus == 'complete' ? 'checked' : ''

        html += `
            <tr class="pointer" id="tr_${element.id}">
                <td class="${rowClass}">${element.student_inscriptions[0] ? element.student_inscriptions[0].course_data.category : ''}</td>
                <td class="${rowClass}">${element.commission_name}</td>
                <td class="${rowClass}">${element.company == null ? 'Particular' : element.company}</td>
                <td class="${rowClass}">${element.cuit_cuil}</td>
                <td class="${rowClass}">${element.first_name + ' ' + element.last_name}</td>
                <td class="${rowClass}">${inscDate}</td>
                <td class="${rowClass}">${gg.formatter0.format(element.price)}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}"><input type="checkbox" id=payment_${element.id} ${checkInput}></td>
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square allowed-icon" id="edit_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-trash-can allowed-icon" id="destroy_${element.id}"></i></td>
                
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)

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