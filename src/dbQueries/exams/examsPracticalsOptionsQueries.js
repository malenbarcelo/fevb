const db = require('../../../database/models')
const model = db.Exams_practicals_options

const examsPracticalsOptionsQueries = {
    get: async({ filters }) => {

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

        if (filters.id_exams_practicals_questions) {
            where.id_exams_practicals_questions = filters.id_exams_practicals_questions
        }

        const data = await model.findAll({
            where,
            order,
            raw:true,
        })

        return data
    },
}

module.exports = examsPracticalsOptionsQueries