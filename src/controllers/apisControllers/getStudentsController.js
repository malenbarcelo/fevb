const studentsQueries = require("../../dbQueries/students/studentsQueries")

const getStudentsController = {
    students: async(req,res) =>{
        try{

            const { size, page, cuit, year_week, id_courses_types, order } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // add filters
            if (cuit) {
                filters.cuit = cuit
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

            //get data
            const data = await studentsQueries.get({limit,offset,filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getStudentsController

