import g from "./globals.js"
import { f } from "./functions.js"
import { gf } from "../../../globalFunctions.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    f.resetData()

    // show tooltips
    //gf.showTooltips(g.tooltips,219,100)

    // filters event listeners
    const filters = [courseType, exam, studentName, cuitCuil]
    for (const filter of filters) {
        filter.addEventListener("change", async () => {
            
            // show loader
            loader.style.display = 'block'

            // complete filters
            g.filters.id_courses_types = Number(courseType.value)
            g.filters.id_exams_practicals = exam.value
            g.filters.cuit_cuil_string = cuitCuil.value
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
        g.filters.id_courses_types = ''
        g.filters.id_exams_practicals = ''
        g.filters.cuit_cuil_string = ''
        g.filters.name = ''

        await f.resetData()
        
        // hide loader
        loader.style.display = 'none'
    })

    //loader.style.display = 'none'

})