const db = require('../../../database/models')
const model = db.Courses_schedule

const scheduleQueries = {
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

        if (filters.year_week) {
            where.year_week = filters.year_week
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

module.exports = scheduleQueries