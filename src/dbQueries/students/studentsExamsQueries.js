const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_exams
const studentsModel = db.Students

const studentsExamsQueries = {
    get: async({ limit, offset, filters }) => {

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

        if (filters.practicals_status) {
            where.practicals_status = filters.practicals_status
        }

        const data = await model.findAndCountAll({            
            include: [
                {association:'exam_practical_data'},
                {
                    association:'theoricals_answers',
                    order:[["id","DESC"]],
                    separate: true
                },
                {
                    association: 'practicals_answers',
                    order:[["id","DESC"]],
                    separate: true
                },
                {
                    association:'student_data',
                    include:[
                        {association:'payments'},
                        {association:'attendance'}

                    ]
                }
            ],
            where,
            limit,
            offset,
            nest:true,
            order: [
                [{ model: studentsModel, as: 'student_data' }, 'name', 'ASC']
            ]
        })

        const plainData = {
            ...data,
            rows: data.rows.map(r => r.get({ plain: true }))
        }

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