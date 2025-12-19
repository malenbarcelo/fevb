import { domain } from "../../../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const f = {
    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`
        filters += g.filters.practicals_status == '' ? '' : `&practicals_status=${g.filters.practicals_status}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`
        filters += g.filters.courses_types_alias == '' ? '' : `&courses_types_alias=${g.filters.courses_types_alias}`
        filters += g.filters.id_exams_practicals == '' ? '' : `&id_exams_practicals=${g.filters.id_exams_practicals}`
        filters += g.filters.cuit == '' ? '' : `&cuit=${g.filters.cuit}`
        filters += g.filters.name == '' ? '' : `&name=${g.filters.name}`

        const fetchData = await (await fetch(`${domain}get/students-exams?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function() {
        
        // get and print data
        g.pendingExams = await f.getData()
        printTable()

    }
}

export { f }