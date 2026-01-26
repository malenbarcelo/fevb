const db = require('../../../database/models')
const model = db.Exams_theoricals

const examsQueries = {
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

        if (filters.exam_url) {
            where.exam_url = filters.exam_url
        }

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        const data = await model.findAll({
            where,
            order,
            raw: true
        })

        return data
    },
}

module.exports = examsQueries