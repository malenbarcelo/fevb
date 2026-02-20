const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_exams_practicals_answers

const studentsExamsPracticalsAnswersQueries = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    }
}

module.exports = studentsExamsPracticalsAnswersQueries