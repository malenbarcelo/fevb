const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_practicals_answers_details

const studentsPracticalsQueriesDetails = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    }
}

module.exports = studentsPracticalsQueriesDetails