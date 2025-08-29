const db = require('../../../database/models')
const model = db.Courses_types

const typesQueries = {
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

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        const data = await model.findAll({
            where,
            order,
            raw: true
        })

        return data
    },
}

module.exports = typesQueries