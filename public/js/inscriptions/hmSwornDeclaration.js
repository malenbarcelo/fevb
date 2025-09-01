window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    // check inputs
    divCde.addEventListener('click',async()=>{
        checkCde.checked = !checkCde.checked
        checkB.checked = false
        error.style.display = 'none'
    })
    divB.addEventListener('click',async()=>{
        checkB.checked = !checkB.checked
        checkCde.checked = false
        error.style.display = 'none'
    })

    // select only one check


    // continue button
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'

        e.preventDefault()
        
        if (!checkB.checked && !checkCde.checked) {
            error.style.display = 'flex'
            loader.style.display = 'none'            
        }else{
            loader.style.display = 'block'
            e.target.form.submit()
        }
    })
})