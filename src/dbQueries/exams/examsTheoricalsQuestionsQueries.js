const db = require('../../../database/models')
const { Sequelize } = require('sequelize')
const model = db.Exams_theoricals_questions

const examsQuestionsQueries = {

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

        if (filters.id_exams_theoricals) {
            where.id_exams_theoricals = filters.id_exams_theoricals
        }

        if (filters.exam_theorical_version) {
            where.exam_theorical_version = filters.exam_theorical_version
        }

        if (filters.exam_theorical_variant) {
            where.exam_theorical_variant = filters.exam_theorical_variant
        }

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        const data = await model.findAll({
            include:[
                {
                    association:'question_options',
                    separate: true,
                    order:[["option_reference","ASC"]],
                }
            ],
            where,
            order,
            nest: true
        })

        const plainData = data.map(d => d.get({ plain: true }))

        return plainData
    },

    uniqueVariants: async({ filters }) => {

        // where
        const where = {}

        if (filters.id_exams_theoricals) {
            where.id_exams_theoricals = filters.id_exams_theoricals
        }

        if (filters.exam_theorical_version) {
            where.exam_theorical_version = filters.exam_theorical_version
        }

        const data = await model.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('exam_theorical_variant')), 'variants']
            ],
            where,
            raw: true
        })

        return data
    },

    getLastVersion: async(idExams) => {

        const data = await model.findOne({
            where: { id_exams_theoricals: idExams },
            order: [['exam_theorical_version', 'DESC']],
            attributes: ['exam_theorical_version'],
        });

        return data
    },
}

module.exports = examsQuestionsQueries