import { domain } from "../../../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const f = {
    getData: async function() {

        let filters = ''
        filters += g.filters.practicals_status == '' ? '' : `&practicals_status=${g.filters.practicals_status}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`
        filters += g.filters.id_courses_types == '' ? '' : `&id_courses_types=${g.filters.id_courses_types}`
        filters += g.filters.id_exams_practicals == '' ? '' : `&id_exams_practicals=${g.filters.id_exams_practicals}`
        filters += g.filters.cuit_cuil_string == '' ? '' : `&cuit_cuil_string=${g.filters.cuit_cuil_string}`
        filters += g.filters.name == '' ? '' : `&name=${g.filters.name}`

        const fetchData = await (await fetch(`${domain}get/students-exams?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function() {
        
        // get and print data
        g.pendingExams = await f.getData()
        const yearsWeeks = [...new Set(
            g.pendingExams.map(p => p.student_data.year_week)
        )]

        g.dates = await (await fetch(`${domain}get/dates?years_weeks=${JSON.stringify(yearsWeeks)}&days_numbers=[1]`)).json()

        printTable()

    }
}

export { f }