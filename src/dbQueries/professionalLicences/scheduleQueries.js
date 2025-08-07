const db = require('../../../database/models')
const model = db.Pl_schedule

const scheduleQueries = {
    get: async({ filters }) => {

        // order
        let order = {}
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        if (filters.id_commissions) {
            where.id_commissions = filters.id_commissions
        }

        if (filters.week_number) {
            where.week_number = filters.week_number
        }

        const data = await model.findAll({
            where,
            nest:true
        })

        const plainData = data.map(d => d.get({ plain: true }))

        return plainData
    },
}

module.exports = scheduleQueries