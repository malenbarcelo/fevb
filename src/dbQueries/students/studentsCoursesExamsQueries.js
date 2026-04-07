const db = require('../../../database/models')
const { Op, fn, col } = require('sequelize') 
const sequelize = require('sequelize')
const model = db.Students_courses_exams

const studentsCoursesExamsQueries = {
    get: async({ limit,offset,filters }) => {

        // order
        let order = []
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        // where student data
        const whereStudentData = {}
        if (filters.enabled) {
            whereStudentData.enabled = { [Op.like]: `%${filters.enabled}%` }
        }

        if (filters.cuit_cuil_string) {
            whereStudentData.cuit_cuil = { [Op.like]: `%${filters.cuit_cuil_string}%` }
        }

        if (filters.name) {
            whereStudentData[Op.and] = [
                sequelize.where(
                    fn('CONCAT', fn('LOWER', col('student_data.first_name')), ' ', fn('LOWER', col('student_data.last_name'))),
                    { [Op.like]: `%${filters.name.toLowerCase()}%` }
                )
            ]
        }

        // repre status
        const whereExamData = {}
        if (filters.repre) {
            if (filters.repre == 'uploaded') {
                where.uploaded_repre = 1
            }
            if (filters.repre == 'enabled') {
                where.uploaded_repre = 0
                whereExamData.theorical_status = 'passed'
                whereExamData.practical_status = { [Op.or]: ['passed', null] }
                whereStudentData.payment_status = 'complete'
                whereStudentData.attendance_status = 'complete'
            }
            if (filters.repre == 'disabled') {
                where.uploaded_repre = {[Op.not]: null}
                where[Op.or] = [
                    {'$exam_data.theorical_status$': {[Op.ne]: 'passed'}},
                    {[Op.and]: [
                        {'$exam_data.practical_status$': {[Op.ne]: 'passed'}},
                        {'$exam_data.practical_status$': {[Op.not]: null}}
                    ]},
                    {'$student_data.payment_status$': {[Op.ne]: 'complete'}},
                    {'$student_data.attendance_status$': {[Op.ne]: 'complete'}}
                ]
            }
        }

        const data = await model.findAndCountAll({            
            include: [                
                {
                    association: 'student_data',
                    include:[{association: 'attendance'}],
                    where: whereStudentData
                },
                {association: 'course_data'},
                {
                    association: 'exam_data',
                    where: whereExamData
                },

            ],
            where,
            limit,
            offset,
            order,
            nest:true
        })

        data.rows = data.rows.map(d => d.get({ plain: true }))

        return data
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData.map(item => item.get({ plain: true }))
    },
    bulkUpdate: async (field, data, dataToUpdate) => {
        await model.update(
            dataToUpdate,
            {
                where: {
                    [field]: {
                        [Op.in]: data
                    }
                }
            }
        )
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

module.exports = studentsCoursesExamsQueries