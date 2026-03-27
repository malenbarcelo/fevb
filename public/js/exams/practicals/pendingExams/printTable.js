import g from "./globals.js"

async function printTable() {

    loader.style.display = 'block'

    body.innerHTML = ''
    let html = ''
    const data = g.pendingExams

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'body pad-9-0 body-even' : 'body pad-9-0 body-odd'
        const paymentIcon = element.payment == 'complete' ? '<i class="fa-solid fa-check fc-green"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>'
        const attendanceIcon = element.attendance == 'complete' ? '<i class="fa-solid fa-check fc-green"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>'
        const theoricalIcon = element.theorical_status == 'passed' ? '<i class="fa-solid fa-check fc-green"></i>' : (element.theorical_status == 'pending' ? '<i class="fa-solid fa-xmark fc-gray"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>')
        const practicalIcon = element.practical_status == 'passed' ? '<i class="fa-solid fa-check fc-green"></i>' : (element.practical_status == 'pending' ? '<i class="fa-solid fa-xmark fc-gray"></i>' : '<i class="fa-solid fa-xmark fc-error"></i>')
        const practicalIcon2 = (element.payment == 'complete' && element.attendance == 'complete') ? `<a href="/examenes/practicos/${element.id}"><i class="fa-solid fa-file-pen"></i></a>` : '<i class="fa-solid fa-ban fc-gray"></i>'
        const dateData = g.dates.filter( d => d.year_week == element.student_data.year_week)[0]
        const week = dateData.date_string + '/' + dateData.year

        const trCss = (element.payment == 'complete' && element.attendance == 'complete') ? 'pointer' : ''
        
        html += `
            <tr class="${trCss}" id="tr_${element.id}">
                <td class="${rowClass}">${element.id_students}</td>                
                <td class="${rowClass}">${element.exam_practical_data.courses_types_alias}</td>
                <td class="${rowClass}">${element.exam_practical_data.exam_alias}</td>
                <td class="${rowClass}">${element.student_data.first_name + ' ' + element.student_data.last_name}</td>
                <td class="${rowClass}">${element.student_data.cuit_cuil}</td>
                <td class="${rowClass}">${week}</td>
                <td class="${rowClass}">${paymentIcon}</td>
                <td class="${rowClass}">${attendanceIcon}</td>
                <td class="${rowClass}">${theoricalIcon}</td>
                <td class="${rowClass}">${practicalIcon}</td>
                <td class="${rowClass}">${practicalIcon2}</td>
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)

    loader.style.display = 'none'

}

function eventListeners(data) {

    data.forEach(element => {

        const tr = document.getElementById('tr_' + element.id)

        // tr
        if (tr && element.payment == 'complete' && element.attendance == 'complete') {
            tr.addEventListener('click',async()=>{
                window.location.href = `/examenes/practicos/${element.id}`
            })
        }
    })
}

export { printTable }