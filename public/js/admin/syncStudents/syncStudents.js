// import g from "./globals.js"
import { gf } from "../../globalFunctions.js"
import { domain } from "../../domain.js"
// import { f } from "./functions.js"
// import { printTable } from "./printTable.js"

// popups
//import { coppEventListeners} from "./asyncStudentsCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // // get data
    // g.filters.page = 1
    // g.filters.size = 25
    // g.students = await f.getData()

    // // print data
    // await f.resetData(true)

    // // close popups
    // gf.closePopups(g.popups)

    // // close with escape
    // gf.closeWithEscape(g.popups)

    // // show tooltips
    // gf.showTooltips(g.tooltips,235,320)

    // // popups event listeners
    // coppEventListeners()

    // // add data with scroll
    // table.addEventListener('scroll', async () => {
    //     if (table.scrollTop > g.previousScrollTop) {  // down scroll
    //         if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
    //             loader.style.display = 'block'
    //             if (!g.loadedPages.has(g.filters.page + 1) && g.filters.page < g.pages){
    //                 g.filters.page += 1
    //                 g.loadedPages.add(g.filters.page)
    //                 const newData = await f.getData()                    
    //                 g.students = [...g.students, ...newData]
    //                 printTable()
    //             }
    //             loader.style.display = 'none'                
    //         }
    //     }
    //     // Update previous position
    //     g.previousScrollTop = table.scrollTop
    // })

    // // filters event listeners
    // const filters = [commission, company, student, cuitCuil, paymentStatus ]
    // for (const filter of filters) {
    //     filter.addEventListener("change", async () => {
            
    //         // show loader
    //         loader.style.display = 'block'

    //         //complete filters
    //         g.filters.commission_name = commission.value
    //         g.filters.company_string = company.value
    //         g.filters.student_string = student.value
    //         g.filters.cuit_cuil = cuitCuil.value
    //         g.filters.payment = paymentStatus.value

    //         await f.resetData()

    //         // hide loader
    //         loader.style.display = 'none'
    //     })
    // }

    // // unfilter event listener
    // unfilter.addEventListener("click", async() => {        
        
    //     // show loader
    //     loader.style.display = 'block'
        
    //     // reset filters
    //     gf.clearInputs(filters)
    //     g.filters.commission_name = ''
    //     g.filters.company_string = ''
    //     g.filters.student_string = ''
    //     g.filters.cuit_cuil = ''
    //     g.filters.payment = ''

    //     await f.resetData()
        
    //     // hide loader
    //     loader.style.display = 'none'
    // })

    // bulk create from google sheets
    bulkInscriptions.addEventListener("click", async() => {

        loader.style.display = 'block'

        // register payment
        const response = await fetch(domain + 'composed/sync-bulk-inscriptions',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
        })

        const responseData = await response.json()

        console.log(responseData)

        if (responseData.response == 'ok') {
            okText.innerText = 'Alumnos registrados con éxito'
            gf.showResultPopup(okPopup)                
        }else{
            errorText.innerText = 'Error al registrar alumnos'
            gf.showResultPopup(errorPopup) 
        }

        loader.style.display = 'none    '
    })

    loader.style.display = 'none'

    

})