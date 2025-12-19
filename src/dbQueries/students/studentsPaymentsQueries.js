const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Students_payments

const studentsPaymentsQueries = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
}

module.exports = studentsPaymentsQueries