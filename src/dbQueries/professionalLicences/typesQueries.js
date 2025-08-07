const db = require('../../../database/models')
const model = db.Pl_types

const typesQueries = {
    get: async({ filters }) => {

        // order
        let order = {}
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        if (filters.ids) {
            where.id = filters.ids
        }

        const data = await model.findAll({
            where,
            raw: true
        })

        return data
    },
}

module.exports = typesQueries