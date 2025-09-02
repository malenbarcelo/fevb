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
    const session = await (await fetch(`${domain}composed/inscriptions/get-session`)).json()

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
            if (typeId == 'R' ) {
                const check = document.getElementById('check_O')
                const info = document.getElementById('info_O')
                check.checked = false
                info.classList.remove('selected-info')
            }

            if (typeId == 'O' ) {
                const check1 = document.getElementById('check_A')
                const info1 = document.getElementById('info_A')
                const check3 = document.getElementById('check_R')
                const info3 = document.getElementById('info_R')
                check1.checked = false
                info1.classList.remove('selected-info')
                check3.checked = false
                info3.classList.remove('selected-info')
            }

            if (typeId == 'A' ) {
                const check = document.getElementById('check_O')
                const info = document.getElementById('info_O')
                check.checked = false
                info.classList.remove('selected-info')
            }

        })
    })

    // add styles if session
    console.log(session)
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