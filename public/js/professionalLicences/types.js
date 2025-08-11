import { domain } from "../domain.js"

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    const allInfo = Array.from(document.querySelectorAll('[id*="info_"]'))
    const allChecks = Array.from(document.querySelectorAll('[id*="check_"]'))
    const session = await (await fetch(`${domain}composed/professional-licences/get-session`)).json()

    // select type with checks
    allInfo.forEach(element => {

        element.addEventListener('click',async()=>{

            error.style.display = 'none'

            const typeId = element.id.split('_')[1]
            const check = document.getElementById('check_' + typeId)

            // check item
            if (check.checked) {
                check.checked = false
                element.classList.remove('selected-info')
            }else{
                check.checked = true
                element.classList.add('selected-info')
            }

            // uncheck elements that can't be selected at the same time
            if (typeId == 1 ) {
                const check = document.getElementById('check_2')
                const info = document.getElementById('info_2')
                check.checked = false
                info.classList.remove('selected-info')
            }

            if (typeId == 2 ) {
                const check = document.getElementById('check_1')
                const info = document.getElementById('info_1')
                check.checked = false
                info.classList.remove('selected-info')
            }

        })
    })

    // add styles if session
    if (session.types) {
        allInfo.forEach(element => {
            const typeId = element.id.split('_')[1]
            const selectedElement = session.types.find( s => s.id == typeId)
            const check = document.getElementById('check_' + typeId)
            if (selectedElement) {
                element.click()                
            }
        })
    }

    // continue
    typeButton.addEventListener('click', function(e) {

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