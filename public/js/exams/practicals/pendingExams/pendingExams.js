import g from "./globals.js"
import { f } from "./functions.js"
import { printTable } from "./printTable.js"
import { gf } from "../../../globalFunctions.js"

// popups event listeners
import { ceppEventListeners} from "./pendingExamsCEPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 50
    g.pendingExams = await f.getData()

    // print table
    printTable()

    // popups event listeners
    ceppEventListeners()

    // close popups
    gf.closePopups(g.popups)

    // close with escape
    gf.closeWithEscape(g.popups)

    // show tooltips
    gf.showTooltips(g.tooltips,219,100)

    loader.style.display = 'none'
    ceppLoader.style.display = 'none'

})