import { domain } from "../../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const f = {
    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.courses_methodology == '' ? '' : `&courses_methodology=${g.filters.courses_methodology}`
        filters += g.filters.student_string == '' ? '' : `&student_string=${g.filters.student_string}`
        filters += g.filters.commission_name == '' ? '' : `&commission_name=${g.filters.commission_name}`
        filters += g.filters.company_string == '' ? '' : `&company_string=${g.filters.company_string}`
        filters += g.filters.payment == '' ? '' : `&payment=${g.filters.payment}`
        filters += g.filters.status == '' ? '' : `&status=${g.filters.status}`
        filters += g.filters.cuit_cuil == '' ? '' : `&cuit_cuil=${g.filters.cuit_cuil}`
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