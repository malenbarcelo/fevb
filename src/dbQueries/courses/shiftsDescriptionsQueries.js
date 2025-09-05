const db = require('../../../database/models')
const model = db.Courses_shifts_descriptions

const shiftsDescriptionsQueries = {
    get: async({ filters }) => {

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

        const data = await model.findAll({
            where,
            order,
            raw: true
        })

        return data
    },
}

module.exports = shiftsDescriptionsQueries