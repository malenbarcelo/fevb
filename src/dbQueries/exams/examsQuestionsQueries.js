const db = require('../../../database/models')
const { Sequelize } = require('sequelize')
const model = db.Exams_questions

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

        if (filters.id_exams) {
            where.id_exams = filters.id_exams
        }

        if (filters.exam_version) {
            where.exam_version = filters.exam_version
        }

        if (filters.exam_variant) {
            where.exam_variant = filters.exam_variant
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

        if (filters.id_exams) {
            where.id_exams = filters.id_exams
        }

        if (filters.exam_version) {
            where.exam_version = filters.exam_version
        }

        const data = await model.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('exam_variant')), 'variants']
            ],
            where,
            raw: true
        })

        return data
    },

    getVersion: async(idExams) => {

        const data = await model.findOne({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('exam_version')), 'version']
            ],
            where: { id_exams: idExams },
            order: [['exam_version','DESC']],
            raw:true
        })

        return data
    },
}

module.exports = examsQuestionsQueries