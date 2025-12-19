import g from "./globals.js"
import { printTable } from "./printTable.js"
import { functions } from "./functions.js"

// confirm popup (copp)
async function coppEventListeners() {

    // confirm popup
    coppAccept.addEventListener('click',async()=>{

        loader.style.display = 'block'
        
        g.students = g.students.filter( s => s.index != g.indexStudentToDelete)

        printTable()

        copp.style.display = 'none'

        loader.style.display = 'none'

    })
}

export {coppEventListeners}