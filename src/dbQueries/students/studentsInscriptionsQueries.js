const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_inscriptions

const studentsInscriptionsQueries = {
    get: async({ filters }) => {

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

        const data = await model.findAll({            
            include: [                
                {
                    association: 'student_data'},
                {
                    association: 'course_data',
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
        return createdData.map(item => item.get({ plain: true }))
    },
}

module.exports = studentsInscriptionsQueries