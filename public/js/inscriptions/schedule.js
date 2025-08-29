window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    
    // continue button
    // continueButton.addEventListener('click', function(e) {

    //     loader.style.display = 'block'

    //     e.preventDefault()
        
    //     if (!checkB.checked) {
    //         error.style.display = 'flex'
    //         loader.style.display = 'none'            
    //     }else{
    //         loader.style.display = 'block'
    //         e.target.form.submit()
    //     }
    // })
})