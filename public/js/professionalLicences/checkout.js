

window.addEventListener('pageshow',async()=>{

    loader.style.display = 'block'

    continueButton.addEventListener('click',async()=>{
        console.log('hola')
        loader.style.display = 'block'
    })

    loader.style.display = 'none'
})

    