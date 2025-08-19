import { domain } from "../domain.js"
import gg from "../globals.js"
import { gf } from "../globalFunctions.js"

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    const schedule = await (await fetch(`${domain}composed/professional-licences/get-schedule`)).json()
    const session = await (await fetch(`${domain}composed/professional-licences/get-session`)).json()

    // select start date
    startDate.addEventListener('change',()=>{

        // hide error if applies
        if (startDate.value != '') {
            scheduleError.style.display = 'none'
            // complete schedule
            const selected = schedule.flatOptions.filter( o => o.id == startDate.value)[0]
            const description1 = selected.description + (selected.ciu ? (' Y ' + selected.ciu_description) : '')
            const description2 = (selected.ciu ? (selected.ciu_description + ' Y ') : '') + selected.description 
            let description = ''
            if (selected.commission_name == "FE_E2_01") {
                description = description2                
            }else{
                description = description1
            }
            
            const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo',]
            const countDays = days.filter(day => description.includes(day)).length
            const dayString = countDays > 1 ? 'días' : 'día'
            
            selectedDates.innerHTML = '<b>TEÓRICO: <i>El curso dura ' + countDays + ' ' + dayString + '.</i></b> Horario: ' + description
        }else{
            selectedDates.innerHTML = '<b>TEÓRICO: </b>Seleccione una fecha de inicio para definir los horarios de cursada del Teórico'
        }
    })
    
    
    // continue
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'
        
        e.preventDefault() 

        // validation
        if (startDate.value != '') {
            e.target.form.submit()
        } else {
            scheduleError.style.display = 'flex'
            loader.style.display = 'none'
        }
    })

    loader.style.display = 'none'


})