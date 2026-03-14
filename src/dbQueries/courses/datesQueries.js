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

        if (filters.weeks_numbers) {
            where.week_number = filters.weeks_numbers
        }

        if (filters.day_number) {
            where.day_number = filters.day_number
        }

        if (filters.year_week) {
            where.year_week = filters.year_week
        }

        const data = await model.findAll({
            where,
            raw: true
        })

        return data
    },
}

module.exports = datesQueries