const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_answers

const studentsAnswersQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id_students_exams) {
            where.id_students_exams = filters.id_students_exams
        }

        const data = await model.findAll({            
            include: [                
                {
                    association: 'theorical_answers',
                    include:[{association:'question_data'}],
                    order:[["id","DESC"]],
                    separate: true
                }
            ],
            where,
            order,
            nest: true
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

module.exports = studentsAnswersQueries