const db = require('../../../database/models')
const model = db.Courses_dates

const datesQueries = {
    get: async({ filters }) => {

        // where
        const where = {}

        if (filters.enabled != undefined) {
            where.enabled = filters.enabled
        }
        if (filters.years) {
            where.year = filters.years
        }

        const data = await model.findAll({
            where,
            raw: true
        })

        return data
    },
}

module.exports = datesQueries