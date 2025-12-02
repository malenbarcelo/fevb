const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_practicals_answers_observations

const studentsPracticalsQueriesObservations = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    }
}

module.exports = studentsPracticalsQueriesObservations