import g from "./globals.js"
import gg from "../../globals.js"
import { u } from "./utils.js"
import { domain } from "../../domain.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.students

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-6-0 body-even' : 'body pad-6-0 body-odd'

        // payment
        const paymentIcon = `<input type="checkbox" id="payment_${element.id}" ${element.payment_status == 'complete' ? 'checked' : ''}>`
        const paid = element.payments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
        const owes = Number(element.price) - paid

        // attendance
        const lmData = element.attendance.find(a => a.day_number == 1 && a.shift_alias=="M")
        const lmDiv = lmData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${lmData.date_string}</div></div>` : ''

        const ltData = element.attendance.find(a => a.day_number == 1 && a.shift_alias=="T")
        const ltDiv = ltData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${ltData.date_string}</div></div>` : ''

        const mmData = element.attendance.find(a => a.day_number == 2 && a.shift_alias=="M")
        const mmDiv = mmData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${mmData.date_string}</div></div>` : ''

        const mtData = element.attendance.find(a => a.day_number == 2 && a.shift_alias=="T")
        const mtDiv = mtData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${mtData.date_string}</div></div>` : ''

        const xmData = element.attendance.find(a => a.day_number == 3 && a.shift_alias=="M")
        const xmDiv = xmData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${xmData.date_string}</div></div>` : ''

        const xtData = element.attendance.find(a => a.day_number == 3 && a.shift_alias=="T")
        const xtDiv = xtData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${xtData.date_string}</div></div>` : ''

        const jmData = element.attendance.find(a => a.day_number == 4 && a.shift_alias=="M")
        const jmDiv = jmData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${jmData.date_string}</div></div>` : ''

        const jtData = element.attendance.find(a => a.day_number == 4 && a.shift_alias=="T")
        const jtDiv = jtData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${jtData.date_string}</div></div>` : ''

        const vmData = element.attendance.find(a => a.day_number == 5 && a.shift_alias=="M")
        const vmDiv = vmData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${vmData.date_string}</div></div>` : ''

        const vtData = element.attendance.find(a => a.day_number == 5 && a.shift_alias=="T")
        const vtDiv = vtData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${vtData.date_string}</div></div>` : ''

        const smData = element.attendance.find(a => a.day_number == 6 && a.shift_alias=="M")
        const smDiv = smData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${smData.date_string}</div></div>` : ''

        const stData = element.attendance.find(a => a.day_number == 6 && a.shift_alias=="T")
        const stDiv = stData ? `<div class="flex-r ai-c jc-c fs-8"><input type="checkbox"><div>${stData.date_string}</div></div>` : ''

        html += `
            <tr class="pointer" id="tr_${element.id}">
                <td class="${rowClass} th-sticky" style="left:0">${element.id}</td>
                <td class="${rowClass} th-sticky" style="left:50px">${element.cuit_cuil}</td>
                <td class="${rowClass} th-sticky" style="left:150px;padding-right:5px"><div style="display:flex;justify-content:space-between;align-items:center;text-align:left">${(element.first_name + ' ' + element.last_name).toUpperCase()} <i class="fa-solid fa-circle-info pointer fc-1" id="info_${element.id}"></i></div></td>
                <td class="${rowClass} th-sticky" style="left:400px">${element.inscription}</td>
                <td class="${rowClass} th-sticky" style="left:550px">${gg.formatter0.format(Number(element.price))}</td>
                <td class="${rowClass} th-sticky" style="left:650px">${owes === 0 ? '-' : gg.formatter0.format(owes)}</td>
                <td class="${rowClass} th-sticky" style="left:700px">${paymentIcon}</td>
                <td class="${rowClass} th-sticky" style="left:780px;background-color:var(--color1)"></td>
                <td class="${rowClass} th-sticky-border">${lmDiv}</td>
                <td class="${rowClass} th-sticky-border">${ltDiv}</td>
                <td class="${rowClass} th-sticky-border">${mmDiv}</td>
                <td class="${rowClass} th-sticky-border">${mtDiv}</td>
                <td class="${rowClass} th-sticky-border">${xmDiv}</td>
                <td class="${rowClass} th-sticky-border">${xtDiv}</td>
                <td class="${rowClass} th-sticky-border">${jmDiv}</td>
                <td class="${rowClass} th-sticky-border">${jtDiv}</td>
                <td class="${rowClass} th-sticky-border">${vmDiv}</td>
                <td class="${rowClass} th-sticky-border">${vtDiv}</td>
                <td class="${rowClass} th-sticky-border">${smDiv}</td>
                <td class="${rowClass} th-sticky-border">${stDiv}</td>
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)

}

function eventListeners(data) {

    data.forEach(element => {

        //const edit = document.getElementById('edit_' + element.id)
        //const destroy = document.getElementById('destroy_' + element.id)
        const payment = document.getElementById('payment_' + element.id)
        //const tr = document.getElementById('tr_' + element.id)

        // edit
        // edit.addEventListener('click',async()=>{
        // })

        // edit row with double click
        // tr.addEventListener('dblclick',async()=>{
        //     if (edit) {
        //         edit.click()
        //     }
        // })

        // destroy
        // destroy.addEventListener('click', async()=>{

        //     loader.style.display = 'block'

        //     g.elementToDestroy = element

        //     g.action = 'destroyElement'

        //     coppText.innerHTML = '¿Confirma que desea eliminar al alumno <b>' + element.first_name + ' ' + element.last_name + '</b>?'

        //     copp.style.display = 'block'

        //     loader.style.display = 'none'

        // })

        // payment
        payment.addEventListener('click', async()=>{

            loader.style.display = 'block'

            if (payment.checked) {

                const paid = element.payments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
                const owes = Number(element.price) - paid

                const data = [{id_students: element.id, amount: owes}]

                // create student payment
                await fetch(domain + 'composed/process-students-payments',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

            }else{

                const data = {condition:'id_students',data:[element.id]}

                // create student payment
                await fetch(domain + 'composed/delete-students-payments',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

            }

            u.resetData(false)

            loader.style.display = 'none'

        })
    })
}

export { printTable }