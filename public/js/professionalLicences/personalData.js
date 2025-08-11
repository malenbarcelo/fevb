import { domain } from "../domain.js"
import { gf } from "../globalFunctions.js"

window.addEventListener('pageshow',async()=>{

    loader.style.display = 'block'

    const inputs = [nameInfo, cuit, email, phone]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // close popups
    gf.closePopups([ecpp])

    // close with escape
    gf.closeWithEscape([ecpp])

    inputs.forEach(input => {
        input.addEventListener('change',async()=>{
            const nullInputs = inputs.filter( i => i.value == '')
            if (nullInputs.length == 0) {
                personalDataError.style.display = 'none'
            }
        })
    })

    // continue
    continueButton.addEventListener('click', async function(e) {

        loader.style.display = 'block'
        
        e.preventDefault()

        const findStudent = await (await fetch(`${domain}get/professional-licences/students?cuit=${cuit.value}&weeks_to_show=true`)).json()

        // validation
        if (nameInfo.value == '' || cuit.value == '' || email.value == '' || phone.value == '') {
            errorText.innerText = 'Debe completar todos los campos'
            personalDataError.style.display = 'flex'
            loader.style.display = 'none'
        } else {
            if (!emailRegex.test(email.value)) {
                errorText.innerText = 'Email incorrecto'
                personalDataError.style.display = 'flex'
                loader.style.display = 'none'
            }else{
                if (findStudent.length > 0) {
                    
                    // alert
                    ecppCuit.innerText = 'Ya existe una reserva para el CUIT ' + cuit.value

                    // selection
                    ecppInfo.innerHTML = ''
                    // get selection summary
                    const types = findStudent[0].selection.map( s => s.type_data.type)
                    const uniqueTypes = [...new Set(types)]
                    uniqueTypes.forEach(ut => {
                        const filterCategories = findStudent[0].selection.filter(s => s.type_data.type == ut)
                        const categories = filterCategories.map( c => c.category_data.category)
                        const flatCategories = categories.join(', ')
                        ecppInfo.innerHTML += '<div class="ta-c mt-5">' + ut.toUpperCase() + ': ' + flatCategories + '</div>'
                        
                    })
                    
                    ecpp.style.display = 'block'

                    loader.style.display = 'none'
                    
                }else{
                    e.target.form.submit()
                }
            }
        }
    })

    loader.style.display = 'none'
})