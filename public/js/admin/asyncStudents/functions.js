import { domain } from "../../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const f = {
    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.courses_methodology == '' ? '' : `&courses_methodology=${g.filters.courses_methodology}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`

        const fetchData = await (await fetch(`${domain}get/students?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function(scroll0) {
        
        // update scroll data
        g.filters.page = 1
        g.loadedPages = new Set()

        if (scroll0) {
            g.previousScrollTop = 0
        }

        // get and print data
        g.students = await this.getData()
        printTable()

        // unscroll
        table.scrollTop = 0
    }
}

export { f }