const db = require('../../../database/models')
const model = db.Pl_commissions

const commissionsQueries = {
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

        if (filters.id_classes) {
            where.id_classes = filters.id_classes
        }

        const data = await model.findAll({
            include:[
                {
                    association:'shifts_data',
                    include:[{association:'shift_data'}]
                }
            ],
            where,
            nest:true
        })

        const plainData = data.map(d => d.get({ plain: true }))

        return plainData
    },
}

module.exports = commissionsQueries