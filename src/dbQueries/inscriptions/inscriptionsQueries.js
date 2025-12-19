const db = require('../../../database/models')
const model = db.Inscriptions

const inscriptionsQueries = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    }
}

module.exports = inscriptionsQueries