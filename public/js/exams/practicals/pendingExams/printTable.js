import g from "./globals.js"

async function printTable() {

    loader.style.display = 'block'

    pendingPracticals.innerHTML = ''
    let html = ''
    const data = g.pendingExams

    data.forEach((element,index) => {

        const examName = element.exam_practical_data.exam_name
        const examStatus = element.practical_enabled ? 'HABILITADO' : 'DESHABILITADO'
        const studentname = (element.student_data.first_name + ' ' + element.student_data.last_name).toUpperCase()
        const cuitCuil = element.student_data.cuit_cuil
        const dateData = g.dates.filter( d => d.year_week == element.student_data.year_week)[0]
        const week = dateData.date_string + '/' + dateData.year
        const paymentCss = element.payment == 'complete' ? 'bck-color-ok-light' : 'bck-color-error-light'
        const paymentIcon = element.payment == 'complete' ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-regular fa-circle-xmark"></i>'
        const paymentIconCss = element.payment == 'complete' ? 'bck-color-ok' : 'bck-color-error'
        const attendanceCss = element.attendance == 'complete' ? 'bck-color-ok-light' : 'bck-color-error-light'
        const attendanceIcon = element.attendance == 'complete' ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-regular fa-circle-xmark"></i>'
        const attendanceIconCss = element.attendance == 'complete' ? 'bck-color-ok' : 'bck-color-error'
        const theoricalCss = element.theorical_status == 'passed' ? 'bck-color-ok-light' : (element.theorical_status == 'not-passed' ? 'bck-color-error-light' : 'bck-color-gray-light')
        const theoricalIcon = element.theorical_status == 'complete' ? '<i class="fa-regular fa-circle-check"></i>' : '<i class="fa-regular fa-circle-xmark"></i>'
        const theoricalIconCss = element.theorical_status == 'passed' ? 'bck-color-ok' : (element.theorical_status == 'not-passed' ? 'bck-color-error' : 'bck-color-gray')
        const href = (element.payment == 'complete' && element.attendance == 'complete') ? `<a href="/examenes/practicos/${element.id}"  class="pending-practical-button ppb-enabled">COMPLETAR PRÁCTICO</a>` : `<div  class="pending-practical-button ppb-unabled">COMPLETAR PRÁCTICO</div>`
        const practicalStatus = element.practical_status == 'pending' ? 'PENDIENTE' : 'DESAPROBADO'

        html += `
            <div class="pending-practical">
                <div class="pending-practical-title">${examName}</div>
                <div class="pending-practical-status">${examStatus}</div>        
                <div class="pending-practical-student"><b>CUIT:</b> ${cuitCuil}  |  <b>${studentname}</b></div>
                <div class="pending-practical-student"><b>CURSADA:</b> ${week}</div>
                <div class="pending-practical-student"><b>ESTADO DEL EXAMEN:</b> ${practicalStatus}</div>
                <div class="pending-practical-row">
                    <div class="pending-practical-box">
                        <div class="pending-practical-box-title ${paymentCss}">PAGO</div>
                        <div class="pending-practical-box-status ${paymentIconCss}">${paymentIcon}</div>
                    </div>
                    <div class="pending-practical-box">
                        <div class="pending-practical-box-title ${attendanceCss}">ASISTENCIA</div>
                        <div class="pending-practical-box-status ${attendanceIconCss}">${attendanceIcon}</div>
                    </div>
                    <div class="pending-practical-box">
                        <div class="pending-practical-box-title ${theoricalCss}">TEÓRICO</div>
                        <div class="pending-practical-box-status ${theoricalIconCss}">${theoricalIcon}</div>
                    </div>
                    
                </div>
                ${href}
                
            </div>
            `
    })

    pendingPracticals.innerHTML = html


    loader.style.display = 'none'

}

export { printTable }
