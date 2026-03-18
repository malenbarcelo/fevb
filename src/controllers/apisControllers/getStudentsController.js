const studentsQueries = require("../../dbQueries/students/studentsQueries")
const getStudentsExams = require("../../utils/studentsExamsUtils")
const getStudentsCoursesExams = require("../../utils/studentsCoursesExamsUtils")

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

            const { size, page, practicals_status, order, id_courses_types, id_exams_practicals, cuit_cuil, cuit_cuil_string, name, enabled } = req.query
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

            if (enabled) {
                filters.enabled = enabled
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

            const { size, page, order, name, cuit_cuil_string, repre, enabled} = req.query
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

            if (enabled) {
                filters.enabled = enabled
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            console.log(limit)
            console.log('page:' + page)
            
            const data = await getStudentsCoursesExams({limit,offset,filters})

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getStudentsController

