import { gf } from "../globalFunctions.js"
import { f } from "./functions.js"

window.addEventListener('pageshow',async()=>{

    loader.style.display = 'block'
    
    // close popups
    gf.closePopups([ecpp])

    // close with escape
    gf.closeWithEscape([ecpp])

    // continue
    continueButton.addEventListener('click', async function(e) {

        loader.style.display = 'block'
        
        e.preventDefault()

        const { errors, errorType } = await f.personalDataValidations(cuitCuil, firstName, lastName, email, phone, errorText, ecpp, ecppCuit)

        if (errors > 0) {

            if (errorType == 'other') {
                personalDataError.style.display = 'flex'
            }else{
                personalDataError.style.display = 'none'
            }
            
            loader.style.display = 'none'
            
        }else{
            e.target.form.submit()
        }
    })

    loader.style.display = 'none'
})

