import { domain } from "../../domain.js"
import g from "./globals.js"
import { f } from "./functions.js"
import { printTable } from "./printTable.js"
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

    })
}

export {coppEventListeners}