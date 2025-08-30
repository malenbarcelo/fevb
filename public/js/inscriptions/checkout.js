
window.addEventListener('load',async()=>{

    // continue button
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'
        e.target.form.submit()
        
    })
})