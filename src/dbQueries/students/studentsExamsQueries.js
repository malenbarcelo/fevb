const db = require('../../../database/models')
const { Op } = require('sequelize') 
const gf = require('../../functions/generalFunctions')
const model = db.Students_exams

const studentsExamsQueries = {
    get: async({ limit, offset, filters }) => {

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

        if (filters.practicals_status) {
            where.practicals_status = filters.practicals_status
        }

        if (filters.theoricals_status) {
            where.theoricals_status = filters.theoricals_status
        }

        if (filters.id_exams_practicals) {
            where.id_exams_practicals = filters.id_exams_practicals
        }

        // where exams practicals
        const whereExamsPracticals = {}
        if (filters.courses_types_alias) {
            whereExamsPracticals.courses_types_alias = filters.courses_types_alias
        }

        // where student data
        const whereStudentData = {}
        if (filters.name) {
            whereStudentData.name = {[Op.like]: `%${gf.specialChars(filters.name)}%`}
        }

        if (filters.cuit_cuil) {
            whereStudentData.cuit_cuil = filters.cuit_cuil
        }

        const data = await model.findAndCountAll({            
            include: [
                {
                    association:'exam_practical_data',
                    where: whereExamsPracticals
                },
                {
                    association:'exam_theorical_data'
                },
                {
                    association:'theoricals_answers',
                    order:[["id","DESC"]],
                    separate: true,
                    include:{association:'theoricals_answers_details'}
                },
                {
                    association: 'practicals_answers',
                    order:[["id","DESC"]],
                    separate: true
                },
                {
                    association:'student_data',
                    where: whereStudentData,
                    include:[
                        {association:'payments'},
                        {association:'attendance'}

                    ]
                }
            ],
            where,
            limit,
            offset,
            nest:true,
            order
            // order: [
            //     [{ model: studentsModel, as: 'student_data' }, 'name', 'ASC']
            // ]
        })

        // plain data and order
        const plainData = {
            ...data,
            rows: data.rows
                .map(r => r.get({ plain: true }))
                .sort((a, b) =>
                    (a.student_data?.name || '').localeCompare(b.student_data?.name || '')
                )
        }

        return plainData
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
    update: async (condition, data) => {

        for (const d of data) {

            let whereCondition = {}

            if (condition == 'id') {
                whereCondition = { id: d.id }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },
}

module.exports = studentsExamsQueries