const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_courses_exams

const studentsCoursesExamsQueries = {
    get: async({ limit,offset,filters }) => {

        // order
        let order = {}
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        const data = await model.findAndCountAll({            
            include: [                
                {
                    association: 'student_data',
                    include:[{association: 'attendance'}]
                },
                {association: 'course_data'},
                {association: 'exam_data'},

            ],
            where,
            limit,
            offset,
            order,
            nest:true
        })

        data.rows = data.rows.map(d => d.get({ plain: true }))

        return data
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData.map(item => item.get({ plain: true }))
    },
    bulkUpdate: async (field, data, dataToUpdate) => {
        await model.update(
            dataToUpdate,
            {
                where: {
                    [field]: {
                        [Op.in]: data
                    }
                }
            }
        )
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

module.exports = studentsCoursesExamsQueries