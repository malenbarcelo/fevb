const studentsQueries = require("../../dbQueries/students/studentsQueries")
const studentsCoursesExamsQueries = require("../../dbQueries/students/studentsCoursesExamsQueries")
const getStudentsExams = require("../../utils/studentsExamsUtils")

const getStudentsController = {
    students: async(req,res) =>{
        try{

            const { size, page, cuit_cuil, year_week, id_courses_types, courses_methodology, user_name, password, order, commission_name, student_string, company_string, payment, status, enabled } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (cuit_cuil) {
                filters.cuit_cuil = cuit_cuil
            }

            if (commission_name) {
                filters.commission_name = commission_name
            }

            if (payment) {
                filters.payment = payment
            }

            if (status) {
                filters.status = status
            }

            if (company_string) {
                filters.company_string = company_string
            }

            if (user_name) {
                filters.user_name = user_name
            }

            if (password) {
                filters.password = password
            }

            if (courses_methodology) {
                filters.courses_methodology = courses_methodology
            }

            if (year_week) {
                filters.year_week = JSON.parse(year_week)
            }

            if (id_courses_types) {
                filters.id_courses_types = JSON.parse(id_courses_types)
            }

            if (enabled) {
                filters.enabled = JSON.parse(enabled)
            }

            if (student_string) {
                filters.student_string = student_string
            }

            if (payment) {
                filters.payment = payment
            }

            // get data
            const data = await studentsQueries.get({limit,offset,filters })

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    studentsExams: async(req,res) =>{
        try{

            const { size, page, practicals_status, order, id_courses_types, id_exams_practicals, cuit_cuil, cuit_cuil_string, name } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (practicals_status) {
                filters.practicals_status = JSON.parse(practicals_status)
            }

            if (id_exams_practicals) {
                filters.id_exams_practicals = id_exams_practicals
            }
            
            if (cuit_cuil) {
                filters.cuit_cuil = cuit_cuil
            }

            if (cuit_cuil_string) {
                filters.cuit_cuil_string = cuit_cuil_string
            }
            
            if (name) {
                filters.name = name
            }

            if (id_courses_types) {
                filters.id_courses_types = id_courses_types
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            const data = await getStudentsExams({limit,offset,filters})

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    studentsCoursesExams: async(req,res) =>{
        try{

            const { size, page, order, name, cuit_cuil_string, repre} = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            if (name) {
                filters.name = name
            }

            if (cuit_cuil_string) {
                filters.cuit_cuil_string = cuit_cuil_string
            }

            if (repre) {
                filters.repre = repre
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get students courses exams
            const data = await studentsCoursesExamsQueries.get({limit,offset,filters})

            // get students exams
            const idsStudents = [...new Set(data.rows.map(d => d.id_students))]
            const studentsExams = await getStudentsExams({undefined,undefined,filters:{id_students:idsStudents}})

            const examsMap = new Map(
                studentsExams.rows.map(e => {
                    const {
                    exam_theorical_questions,
                    theoricals_answers,
                    practicals_answers,
                    student_data,
                    ...cleanExam
                    } = e

                    return [e.id, cleanExam]
                })
            )

            data.rows = data.rows.map(d => ({
                ...d,
                exams_results: examsMap.get(d.id_students_exams) || null
            }))

            // add filters
            if (filters.name) {
                data.rows = data.rows.filter(d =>
                    (d.student_data.first_name.toLowerCase() + ' ' + d.student_data.last_name.toLowerCase())
                        .toLowerCase()
                        .includes(filters.name.toLowerCase())
                )
            }
            if (filters.cuit_cuil_string) {
                data.rows = data.rows.filter(d => String(d.student_data.cuit_cuil).includes(String(filters.cuit_cuil_string)))
            }

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getStudentsController

