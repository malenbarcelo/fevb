import g from "./globals.js"
import { gf } from "../../globalFunctions.js"
import { utils } from "./utils.js"
import { printTable } from "./printTable.js"
import { domain } from "../../domain.js"

// popups
import { drppEventListeners} from "./examsDRPP.js"
import { coppEventListeners} from "./examsCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.filters.page = 1
    g.filters.size = 25
    g.studentsCoursesExams = await utils.getData()

    // print data
    await utils.resetData(true)

    // close popups
    gf.closePopups(g.popups)

    // close with escape
    gf.closeWithEscape(g.popups)

    // // show tooltips
    // gf.showTooltips(g.tooltips,235,320)

    // popups event listeners
    drppEventListeners()
    coppEventListeners()

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

            // complete filters
            g.filters.name = student.value
            g.filters.cuit_cuil_string = cuitCuil.value
            g.filters.repre = repre.value

            // data
            g.filters.page = repre.value == 'enabled' ? '' : 1
            g.filters.size = repre.value == 'enabled' ? '' : 25

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

        // data
        g.filters.page = 1
        g.filters.size = 25

        await utils.resetData()
        
        // hide loader
        loader.style.display = 'none'
    })

    // download repre
    downloadRepre.addEventListener('click',async()=>{

        loader.style.display = 'block'

        // findout if there repre to upload
        const repreEnabled = await (await fetch(`${domain}get/students-courses-exams?enabled=1&repre=enabled`)).json()

        if (repreEnabled.rows.length == 0) {
            arpp.style.display = 'block'

        }else{

            const response = await fetch(domain + 'composed/exams/download-repre',{
                method:'POST',
                headers: {'Content-Type': 'application/json'}
            })

            if (response.ok) {

                // download excel
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'Envío ' + Math.floor(Date.now() / 1000)  + '.xlsx'
                document.body.appendChild(a)
                a.click()
                a.remove()

                // check downloaded repre
                const ids = JSON.parse(response.headers.get('X-Downloaded-Ids'))
                const data = {
                    field: 'id',
                    elementsToUpdate: ids,
                    dataToUpdate: {uploaded_repre: 1}
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
                    drpp.style.display = 'block'
                }
            } 
        }

        loader.style.display = 'none'
    })

    loader.style.display = 'none'

})