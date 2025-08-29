const db = require('../../../database/models')
const model = db.Courses_prices

const pricesQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id_courses) {
            where.id_courses = filters.id_courses
        }

        const data = await model.findAll({
            where,
            order,
            limit:100, // to avoid bringing all data, is not necessary
            raw: true
        })

        return data
    },
}

module.exports = pricesQueries