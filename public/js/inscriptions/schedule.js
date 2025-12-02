
import { domain } from "../domain.js"

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options`)).json()

    // select date
    selectDate.addEventListener('change', () =>{

        error.style.display = 'none'
        
        if (selectDate.value != '') {
            const selectedShift = scheduleOptions.find( s => s.id == selectDate.value)
            const daysNumber = selectedShift.daysShifts.length
            const daysString = daysNumber == 1 ? 'día' : 'días'
            days.innerHTML = ''
            selectedDates.innerHTML = '<b>TEÓRICO: <i>La cursada es de ' + daysNumber + ' ' + daysString + '</i></b>:'
            selectedShift.daysShifts.forEach(d => {
                days.innerHTML += '<div>-  ' +  d.day + ' ' + d.shifts[0].date_string + ' ' + d.shiftDescription + ' <b>(' + d.duration + ' horas)</b></div>'
                
            });
            
        }else{
            selectedDates.innerHTML = '<b>TEÓRICO: </b>Seleccione una fecha de inicio para definir los horarios de cursada del Teórico'
            days.innerHTML = ''
        }
    })
    
    // continue button
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'

        e.preventDefault()
        
        if (selectDate.value == '') {
            error.style.display = 'flex'
            loader.style.display = 'none'            
        }else{
            loader.style.display = 'block'
            e.target.form.submit()
        }
    })
})