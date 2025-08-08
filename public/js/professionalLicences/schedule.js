import { domain } from "../domain.js"
import gg from "../globals.js"
import { gf } from "../globalFunctions.js"

window.addEventListener('pageshow',async()=>{

    loader.style.display = 'block'

    const schedule = await (await fetch(`${domain}composed/professional-licences/get-schedule`)).json()

    // select start date
    startDate.addEventListener('change',()=>{

        // hide error if applies
        if (startDate.value != '') {
            scheduleError.style.display = 'none'
            // complete schedule
            const selected = schedule.flatOptions.filter( o => o.id == startDate.value)[0]
            const description = selected.description + (selected.ciu ? (' Y ' + selected.ciu_description) : '')
            selectedDates.innerHTML = '<b>TEÓRICO: </b>' + description
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