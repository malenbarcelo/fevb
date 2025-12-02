const db = require('../../../database/models')
const model = db.Exams_practicals_teachers

const examsPracticalsTeachersQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }else{
            order = [["ID", "ASC"]]
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        const data = await model.findAll({
            where,
            order,
            raw: true
        })

        return data
    },
}

module.exports = examsPracticalsTeachersQueries