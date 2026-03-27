import g from "./globals.js"
import { domain } from "../../domain.js"
import { utils } from "./utils.js"

// confirm popup (copp)
async function coppEventListeners() {

    // accept
    coppAccept.addEventListener('click', async () => {

        if (g.action == 'checkRepre') {

            loader.style.display = 'block'
            copp.style.display = 'none'

            const id = [g.elementToUpdate.id]
            const data = {
                field: 'id',
                elementsToUpdate: id,
                dataToUpdate: {uploaded_repre: g.repre}
            }

            const responseUpdate = await fetch(domain + 'update/bulk/students/courses-exams',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)            
            })

            const respondeUpdateData = await responseUpdate.json()

            if (respondeUpdateData.response == 'ok') {

                // reset data
                await utils.resetData()
                
                // show popup
                loader.style.display = 'none'
            }
        } 
    })

}

export { coppEventListeners }