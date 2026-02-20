const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_exams_theoricals_answers

const studentsExamsTheoricalsAnswersQueries = {
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