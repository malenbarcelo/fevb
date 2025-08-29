window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    // check inputs
    divCde.addEventListener('click',async()=>{
        checkCde.checked = !checkCde.checked
    })
    divB.addEventListener('click',async()=>{
        checkB.checked = !checkB.checked
        error.style.display = 'none'
    })

    // continue button
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'

        e.preventDefault()
        
        if (!checkB.checked) {
            error.style.display = 'flex'
            loader.style.display = 'none'            
        }else{
            loader.style.display = 'block'
            e.target.form.submit()
        }
    })
})