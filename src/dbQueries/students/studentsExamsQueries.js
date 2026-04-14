const db = require('../../../database/models')
const { Op, fn, col } = require('sequelize') 
const sequelize = require('sequelize')
const gf = require('../../utils/generalFunctions')
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

        if (filters.id_exams_practicals) {
            where.id_exams_practicals = filters.id_exams_practicals
        }

        if (filters.practicals_status) {
            where.practical_status = filters.practicals_status
        }

        if (filters.theoricals_status) {
            where.theorical_status = filters.theoricals_status
        }

        // where student data
        const whereStudentData = {}
        if (filters.cuit_cuil) {
            whereStudentData.cuit_cuil = filters.cuit_cuil
        }
        if (filters.cuit_cuil_string) {
            whereStudentData.cuit_cuil = {
                [Op.like]: `%${filters.cuit_cuil_string}%`
            }
        }
        if (filters.id_courses_types) {
            whereStudentData.id_courses_types = filters.id_courses_types
        }
        if (filters.enabled) {
            whereStudentData.enabled = filters.enabled
        }

        if (filters.name) {
            whereStudentData[Op.and] = [
                sequelize.where(
                    fn('CONCAT', col('student_data.first_name'), ' ', col('student_data.last_name')),
                    {
                        [Op.like]: `%${filters.name}%`
                    }
                )
            ]
        }

        const data = await model.findAndCountAll({            
            include: [
                {
                    association:'exam_practical_data',
                },
                {
                    association:'exam_theorical_data'
                },
                {
                    association:'courses_exams',
                    include:[
                        {
                            association:'course_data',
                        }
                    ]
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
        const plainData = createdData.map(d => d.get({ plain: true }))
        return plainData
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