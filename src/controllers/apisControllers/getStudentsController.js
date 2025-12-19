const studentsQueries = require("../../dbQueries/students/studentsQueries")
const examsPracticalsQuestionsQueries = require("../../dbQueries/exams/examsPracticalsQuestionsQueries")
const getStudentsExams = require("../../functions/getStudentsExams")

const getStudentsController = {
    students: async(req,res) =>{
        try{

            const { size, page, cuit_cuil, year_week, id_courses_types, courses_methodology, user_name, password, order } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (cuit_cuil) {
                filters.cuit_cuil = cuit_cuil
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

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            const data = await studentsQueries.get({limit,offset,filters })

            // add payment status and attendance
            data.rows.forEach(row => {
                const amountPaid = row.payments.map( p => Number(p.amount)).reduce((acc, el) => acc + el, 0)
                const attendance = row.attendance.find( a => a.attendend == 0)
                row.paymentStatus = amountPaid >= Number(row.price) ? 'complete' : 'incomplete'
                row.attendanceStatus = attendance ? 'incomplete' : 'complete'
            })

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

            const { size, page, practicals_status, order, courses_types_alias, id_exams_practicals, cuit_cuil, name } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (practicals_status) {
                filters.practicals_status = JSON.parse(practicals_status)
            }
            if (courses_types_alias) {
                filters.courses_types_alias = courses_types_alias
            }
            if (id_exams_practicals) {
                filters.id_exams_practicals = id_exams_practicals
            }
            if (cuit_cuil) {
                filters.cuit_cuil = cuit_cuil
            }
            if (name) {
                filters.name = name
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
}
module.exports = getStudentsController

