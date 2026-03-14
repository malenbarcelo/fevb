const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_exams_practicals_answers

const studentsExamsPracticalsAnswersQueries = {
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

            if (condition == 'student_exam_question') {
                whereCondition = { 
                    id_students: d.id_students,
                    id_students_exams: d.id_students_exams,
                    id_exams_practicals_questions: d.id_exams_practicals_questions 
                }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },
}

module.exports = studentsExamsPracticalsAnswersQueries