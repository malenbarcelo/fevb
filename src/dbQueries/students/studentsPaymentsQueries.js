const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_payments

const studentsPaymentsQueries = {
    create: async(data, allowDuplicates = true) => {

        if (allowDuplicates) {
            return await model.bulkCreate(data)
        }
        
        // find existing
        const existing = await model.findAll({
            where: {
                [Op.or]: data.map(d => ({
                    id_students: d.id_students,
                    amount: d.amount
                }))
            },
            attributes: ['id_students', 'amount'],
            raw: true
        })
        
        const existingSet = new Set(
            existing.map(e => `${e.id_students}-${Number(e.amount)}`)
        )

        const filtered = data.filter(
            d => !existingSet.has(`${d.id_students}-${d.amount}`)
        )

        if (!filtered.length) return []

        return await model.bulkCreate(filtered)
    },

    update: async (condition, data) => {

        for (const d of data) {

            let whereCondition = {}

            if (condition == 'id') {
                whereCondition = { id: d.id }
            }

            if (condition == 'id_students') {
                whereCondition = { id_students: d.id_students }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },
}

module.exports = studentsPaymentsQueries