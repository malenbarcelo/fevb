import { domain } from "../../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const utils = {
    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.name == '' ? '' : `&name=${g.filters.name}`
        filters += g.filters.cuit_cuil_string == '' ? '' : `&cuit_cuil_string=${g.filters.cuit_cuil_string}`
        filters += g.filters.repre == '' ? '' : `&repre=${g.filters.repre}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`

        const fetchData = await (await fetch(`${domain}get/students-courses-exams?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function(scroll0) {
        
        // update scroll data
        g.filters.page = repre.value == 'enabled' ? '' : 1
        g.loadedPages = new Set()

        if (scroll0) {
            g.previousScrollTop = 0
        }

        // get and print data
        g.studentsCoursesExams = await this.getData()
        printTable()

        // unscroll
        table.scrollTop = 0
    }
}

export { utils }