import g from "./globals.js"
// import { gf } from "../../globalFunctions.js"
import { utils } from "./utils.js"
import { printTable } from "./printTable.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 25
    g.studentsCoursesExams = await utils.getData()

    // print data
    await utils.resetData(true)

    // // close popups
    // gf.closePopups(g.popups)

    // // close with escape
    // gf.closeWithEscape(g.popups)

    // // show tooltips
    // gf.showTooltips(g.tooltips,235,320)

    // // popups event listeners
    // coppEventListeners()

    // add data with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'
                if (!g.loadedPages.has(g.filters.page + 1) && g.filters.page < g.pages){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await utils.getData()                    
                    g.studentsCoursesExams = [...g.studentsCoursesExams, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })

    // filters event listeners
    const filters = [student, cuitCuil, repre ]
    for (const filter of filters) {
        filter.addEventListener("change", async () => {
            
            // show loader
            loader.style.display = 'block'

            //complete filters
            g.filters.name = student.value
            g.filters.cuit_cuil_string = cuitCuil.value
            g.filters.repre = repre.value

            await utils.resetData()

            // hide loader
            loader.style.display = 'none'
        })
    }

    // unfilter event listener
    unfilter.addEventListener("click", async() => {        
        
        // show loader
        loader.style.display = 'block'
        
        // reset filters
        gf.clearInputs(filters)
        g.filters.name = ''
        g.filters.cuit_cuil_string = ''
        g.filters.student_string = ''
        g.filters.repre = ''

        await utils.resetData()
        
        // hide loader
        loader.style.display = 'none'
    })

    loader.style.display = 'none'

    

})