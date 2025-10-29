const db = require('../../../database/models')
const model = db.Courses_ciu_schedule

const ciuScheduleQueries = {
    get: async({ filters }) => {

        const where = {}

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

module.exports = ciuScheduleQueries