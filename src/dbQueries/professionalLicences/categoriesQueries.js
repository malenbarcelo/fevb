const db = require('../../../database/models')
const model = db.Pl_categories

const categoriesQueries = {
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

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        const data = await model.findAll({
            where,
            raw: true
        })

        return data
    },
}

module.exports = categoriesQueries