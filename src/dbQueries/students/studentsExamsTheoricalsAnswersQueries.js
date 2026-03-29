const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_exams_theoricals_answers

const studentsExamsTheoricalsAnswersQueries = {
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

        if (filters.id_students_exams) {
            where.id_students_exams = filters.id_students_exams
        }

        const data = await model.findAndCountAll({            
            where,
            limit,
            offset,
            nest:true,
            order
        })

        // plain data and order
        const plainData = {
            ...data,
            rows: data.rows
                .map(r => r.get({ plain: true }))
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

            if (condition == 'id_students_exams') {
                whereCondition = { id_students_exams: d.id_students_exams }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },
}

module.exports = studentsExamsTheoricalsAnswersQueries