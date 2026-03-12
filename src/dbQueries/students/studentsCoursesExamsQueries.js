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
                {association: 'student_data'},
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
}

module.exports = studentsCoursesExamsQueries