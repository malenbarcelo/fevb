import g from "./globals.js"
import { functions } from "./functions.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.students

    data.forEach((element,index) => {

        const rowClass = index % 2 == 0 ? 'body pad-7-0 body-even' : 'body pad-7-0 body-odd'

        html += `
            <tr class="pointer fs-12" id="tr_${element.index}">
                <td class="${rowClass}">${element.cuit_cuil}</td>
                <td class="${rowClass}">${element.first_name}</td>
                <td class="${rowClass}">${element.last_name}</td>
                <td class="${rowClass}">${element.email}</td>
                <td class="${rowClass}">${element.phone_number}</td>
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square allowed-icon" id="edit_${element.index}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-trash-can allowed-icon" id="destroy_${element.index}"></i></td>                
            </tr>
            `
    })

    // add blank rows
    const rowsQty = 14 - data.length
    
    for (let i = 0; i < rowsQty; i++) {

        const evenBody = data.length % 2 == 0 ? 'body h-20 body-even' : 'body h-20 body-odd'
        const oddBOdy = data.length % 2 == 0 ? 'body h-20 body-odd' : 'body h-20 body-even'

        const rowClass = i % 2 == 0 ? evenBody : oddBOdy

        html += `
            <tr class="pointer">
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
            </tr>
            `
        
    }

    body.innerHTML = html

    functions.updatePrice()

    continueError.classList.add('not-visible')

    eventListeners(data)

}

function eventListeners(data) {

    data.forEach(element => {

        const edit = document.getElementById('edit_' + element.index)
        const destroy = document.getElementById('destroy_' + element.index)
        const tr = document.getElementById('tr_' + element.index)

        // edit
        edit.addEventListener('click',async()=>{

            g.action = 'edit'
            g.indexStudentToEdit = element.index
            cesppAcceptButton.innerText = 'ACEPTAR'
            cesppError.style.display = 'none'
            cesppStudentError.style.display = 'none'
            cesppFirstName.value = element.first_name
            cesppLastName.value = element.last_name
            cesppCuitCuil.value = element.cuit_cuil
            cesppEmail.value = element.email
            cesppPhone.value = element.phone_number
            cespp.style.display = 'block'
            cesppFirstName.focus()
            cespp.style.display = 'block'
        })

        // edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        // destroy
        destroy.addEventListener('click',async()=>{
            coppText.innerHTML = '¿Confirma que desea eliminar al alumno <b>' + element.first_name.toUpperCase() + ' ' + element.last_name.toUpperCase() + '</b>?'
            g.indexStudentToDelete = element.index
            copp.style.display = 'block'
            
        })
    })
}

export { printTable }