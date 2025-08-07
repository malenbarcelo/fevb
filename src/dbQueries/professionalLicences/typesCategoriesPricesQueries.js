
const db = require('../../../database/models')
const model = db.Pl_types_categories_prices

const typesCategoriesPricesQueries = {
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

        const data = await model.findAll({
            where,
            raw: true,
            nest:true
        })

        return data
    },
}

module.exports = typesCategoriesPricesQueries