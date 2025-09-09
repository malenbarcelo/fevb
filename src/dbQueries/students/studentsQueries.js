const db = require('../../../database/models')
const { Op, Association } = require('sequelize') 
const model = db.Students

const studentsQueries = {
    get: async({ limit, offset, filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        if (filters.cuit) {
            where.cuit = filters.cuit
        }

        if (filters.id_courses_types) {
            where.id_courses_types = filters.id_courses_types
        }

        if (filters.year_week) {
            where.year_week = filters.year_week        }

        
        const data = await model.findAndCountAll({
            include:[{association: 'course_type_data'}],            
            order,
            where,
            limit,
            offset,
            nest:true
        })

        return data
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
}

module.exports = studentsQueries