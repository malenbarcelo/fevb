import { gf } from "../globalFunctions.js"

window.addEventListener('pageshow',async()=>{

    loader.style.display = 'block'
    
    // continue
    continueButton.addEventListener('click', async function(e) {

        loader.style.display = 'block'
        
        e.preventDefault()

        let errors = companyDataValidations()

        if (errors > 0){
            errorText.classList.remove('not-visible')
            loader.style.display = 'none'
        }else{
            e.target.form.submit()
        }
    })

    loader.style.display = 'none'
})


function companyDataValidations(){

    let errors = 0    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    // validation
    if (company.value == '' || firstName.value == '' || lastName.value == '' || email.value == '' || phone.value == '') {

        errors += 1
        errorText.innerText = 'Debe completar todos los campos'

    } else{

        const phoneNumber = /^\d+$/.test(phone.value)
        const phoneLength = phone.value.toString().length

        if (phone.value == '' || !phoneNumber || phoneLength < 7) {

            errors += 1
            errorText.innerText = 'El número de teléfono debe ser numérico y debe poseer como mínimo 7 dígitos'                    

        }else{

            if (!emailRegex.test(email.value)) {

                errors += 1
                errorText.innerText = 'Email inválido'

            }
        }
    }
    
    
    return errors

}
