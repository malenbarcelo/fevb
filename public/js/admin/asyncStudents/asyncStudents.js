import g from "./globals.js"
import { gf } from "../../globalFunctions.js"
import { f } from "./functions.js"
import { printTable } from "./printTable.js"

// popups
import { coppEventListeners} from "./asyncStudentsCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 25
    g.students = await f.getData()

    // print data
    await f.resetData(true)

    // close popups
    gf.closePopups(g.popups)

    // close with escape
    gf.closeWithEscape(g.popups)

    // show tooltips
    gf.showTooltips(g.tooltips,235,320)

    // popups event listeners
    coppEventListeners()

    // add data with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'
                if (!g.loadedPages.has(g.filters.page + 1) && g.filters.page < g.pages){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await f.getData()                    
                    g.students = [...g.students, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })


    


    loader.style.display = 'none'

    

})