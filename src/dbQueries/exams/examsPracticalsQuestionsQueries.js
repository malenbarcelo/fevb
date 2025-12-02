const db = require('../../../database/models')
const model = db.Exams_practicals_questions

const examsPracticalsQuestionsQueries = {
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

        if (filters.id_exams_practicals) {
            where.id_exams_practicals = filters.id_exams_practicals
        }

        if (filters.exam_practical_version) {
            where.exam_practical_version = filters.exam_practical_version
        }

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        const data = await model.findAll({
            include:[{association:'question_options'}],
            where,
            order,
            nest:true,
        })

        return data
    },
    getLastVersion: async(idExams) => {

        const data = await model.findOne({
            where: { id_exams_practicals: idExams },
            order: [['exam_practical_version', 'DESC']],
            attributes: ['exam_practical_version'],
        });

        return data
    },
}

module.exports = examsPracticalsQuestionsQueries