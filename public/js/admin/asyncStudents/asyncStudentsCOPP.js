import { domain } from "../../domain.js"
import g from "./globals.js"
import { f } from "./functions.js"
import { gf } from "../../globalFunctions.js"

// confirm popup (copp)
async function coppEventListeners() {

    // confirm popup
    coppAccept.addEventListener('click',async()=>{

        loader.style.display = 'block'
        copp.style.display = 'none'

        if (g.action == 'createPayment') {

            const data = g.elementsToCreate

            // register payment
            await fetch(domain + 'create/students/payments',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            
            f.resetData(false)

            loader.style.display = 'none'
            
        }

        if (g.action == 'destroyElement') {

            const data = {
                condition: 'id',
                data:[{
                    id:g.elementToDestroy.id,
                    dataToUpdate: {enabled:0}
                }]
            }

            // register payment
            const response = await fetch(domain + 'update/students',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            if (responseData.response == 'ok') {
                okText.innerText = 'Alumno eliminado con éxito'
                gf.showResultPopup(okPopup)                
            }else{
                errorText.innerText = 'Error al eliminar el alumno'
                gf.showResultPopup(errorPopup) 
            }
            
            f.resetData(false)

            loader.style.display = 'none'
            
        }

    })
}

export {coppEventListeners}