import g from "./globals.js"
import { f } from "./functions.js"
import { gf } from "../../../globalFunctions.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 50
    f.resetData()

    // show tooltips
    gf.showTooltips(g.tooltips,219,100)

    // filters event listeners
    const filters = [courseType, exam, studentName, cuit]
    for (const filter of filters) {
        filter.addEventListener("change", async () => {
            
            // show loader
            loader.style.display = 'block'

            // complete filters
            g.filters.courses_types_alias = courseType.value
            g.filters.id_exams_practicals = exam.value
            g.filters.cuit = cuit.value
            g.filters.name = studentName.value

            await f.resetData()

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
        g.filters.courses_types_alias = ''
        g.filters.id_exams_practicals = ''
        g.filters.cuit = ''
        g.filters.name = ''

        await f.resetData()
        
        // hide loader
        loader.style.display = 'none'
    })

    loader.style.display = 'none'

})