window.addEventListener('load',async()=>{

    const allInfo = Array.from(document.querySelectorAll('[id*="info_"]'))
    const allChecks = Array.from(document.querySelectorAll('[id*="check_"]'))

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

    // continue
    typeButton.addEventListener('click', function(e) {
        
        e.preventDefault() 

        // validation
        const checked = allChecks.filter( ac => ac.checked)

        if (checked.length > 0) {
            e.target.form.submit()
        } else {
            error.style.display = 'flex'
        }
    })
})