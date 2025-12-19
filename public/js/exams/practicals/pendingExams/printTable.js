import g from "./globals.js"
import { f } from "./functions.js"

async function printTable() {

    body.innerHTML = ''
    let html = ''
    const data = g.pendingExams

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
                <td class="${rowClass}">
                    <a href="/examenes/examen-practico/${element.id}">
                        <i class="fa-solid fa-file-pen allowed-icon"></i>
                    </a>
                </td>
            </tr>
            `
    })

    body.innerHTML = html

}

export { printTable }