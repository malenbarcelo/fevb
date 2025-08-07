const { Op } = require('sequelize')
const db = require('../../../database/models')
const { raw } = require('mysql2')
const model = db.Pl_dates

const datesQueries = {
    get: async({ filters }) => {

        // order
        let order = {}
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.week_number) {
            where.week_number = filters.week_number
        }

        if (filters.year) {
            where.year = filters.year
        }

        if (filters.day_number) {
            where.day_number = filters.day_number
        }

        const data = await model.findAll({
            where,
            raw:true
        })

        return data
    },
    // getByWeeks: async(weeks) => {

    //     const conditions = weeks.map(w => ({
    //         year: w.year,
    //         week_number: w.week_number
    //     }))

    //     const data = await model.findAll({
    //         where: {
    //             [Op.or]: conditions
    //         },
    //         raw:true
    //     })

    //     return data
    // },
}

module.exports = datesQueries