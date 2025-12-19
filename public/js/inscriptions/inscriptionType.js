import { gf } from "../globalFunctions.js"
import { domain } from "../domain.js"

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    const allOptions = Array.from(document.querySelectorAll('[id*="option_"]'))
    const allChecks = Array.from(document.querySelectorAll('[id*="check_"]'))
    const session = await (await fetch(`${domain}composed/inscriptions/get-session`)).json()

    // uncheck all
    gf.uncheckAll(allOptions)


    // select type with checks
    allOptions.forEach(element => {

        element.addEventListener('click',async()=>{
            
            error.style.display = 'none'

            const typeId = element.id.split('_')[1]
            const check = document.getElementById('check_' + typeId)
            const text = document.getElementById('text_' + typeId)

            // check item
            if (check.checked) {
                check.checked = false
                element.classList.remove('selected-option')
                text.classList.remove('insc-type-text-selected')
            }else{
                check.checked = true
                element.classList.add('selected-option')
                text.classList.add('insc-type-text-selected')
            }

            // uncheck elements that can't be selected at the same time
            if (typeId == 'C' ) {
                const check = document.getElementById('check_P')
                const option = document.getElementById('option_P')
                const text = document.getElementById('text_P')
                check.checked = false
                option.classList.remove('selected-option')
                text.classList.remove('insc-type-text-selected')
            }
            if (typeId == 'P' ) {
                const check = document.getElementById('check_C')
                const option = document.getElementById('option_C')
                const text = document.getElementById('text_C')
                check.checked = false
                option.classList.remove('selected-option')
                text.classList.remove('insc-type-text-selected')
            }

        })
    })

    // add styles
    if (session.company == 'Particular') {
        const check = document.getElementById('check_P')
        const option = document.getElementById('option_P')
        const text = document.getElementById('text_P')
        check.checked = true
        option.classList.add('selected-option')
        text.classList.add('insc-type-text-selected')
    }
    if (session.company == 'Empresa') {
        const check = document.getElementById('check_C')
        const option = document.getElementById('option_C')
        const text = document.getElementById('text_C')
        check.checked = true
        option.classList.add('selected-option')
        text.classList.add('insc-type-text-selected')
    }

    // continue
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'
        
        e.preventDefault() 

        // validation
        const checked = allChecks.filter( ac => ac.checked)

        if (checked.length > 0) {
            e.target.form.submit()
        } else {
            error.style.display = 'flex'
            loader.style.display = 'none'
        }
    })

    loader.style.display = 'none'
})