const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_exams

const studentsExamsQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        const data = await model.findAll({            
            include: [                
                {
                    association: 'student_data'},
                {
                    association: 'exam_data',
                }
            ],
            where,
            nest:true
        })

        const plainData = data.map(d => d.get({ plain: true }))

        return plainData
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
    update: async (condition, data) => {

        for (const d of data) {

            let whereCondition = {}

            if (condition == 'id') {
                whereCondition = { id: d.id }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },
}

module.exports = studentsExamsQueries