const db = require('../../../database/models')
const gf = require("../../utils/generalFunctions")
const { Op } = require('sequelize') 
const model = db.Students

const studentsQueries = {
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

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        if (filters.cuit_cuil) {
            where.cuit_cuil = {[Op.like]: `%${gf.specialChars(filters.cuit_cuil)}%`}
        }

        if (filters.user_name && filters.user_name == 'null') {
            where.user_name = {[Op.is]: null}
        }

        if (filters.password) {
            where.password = filters.password
        }

        if (filters.commission_name) {
            where.commission_name = {[Op.like]: `%${gf.specialChars(filters.commission_name)}%`}
        }

        if (filters.company_string) {
            where.company = {[Op.like]: `%${gf.specialChars(filters.company_string)}%`}
        }

        if (filters.student_string) {
            where.first_name = {[Op.like]: `%${gf.specialChars(filters.student_string)}%`}
        }

        if (filters.created_user) {
            if (filters.created_user == 'no') {
                where.user_name = null
            }
        }

        if (filters.id_courses_types) {
            where.id_courses_types = filters.id_courses_types
        }

        if (filters.year_week) {
            where.year_week = filters.year_week
        }

        if (filters.courses_methodology) {
            where.courses_methodology = filters.courses_methodology
        }

        const data = await model.findAndCountAll({
            include:[
                {association: 'course_type_data'},
                {
                    association: 'student_inscriptions',
                    include: [
                        {
                            association:'course_data',
                        }
                    ]
                },

                {
                    association: 'student_exams',
                    // include: [
                    //     { 
                    //         association:'student_answer_data',
                    //         require: true,
                    //         include: [{association: 'answers'}] 
                    //     },
                    //     { association:'exam_data' }
                    // ],
                    // require: true
                },
                {association: 'attendance'},
                {association: 'payments'},
            ],            
            order,
            where,
            limit,
            offset,
            distinct: true,
            nest:true
        })

        // plain data and order
        const plainData = {
            ...data,
            rows: data.rows.map(r => r.get({ plain: true }))
        }

        // add payment status, attendance, and full name
        plainData.rows.forEach(row => {
            const amountPaid = row.payments.map( p => Number(p.amount)).reduce((acc, el) => acc + el, 0)
            const attendance = row.attendance.find( a => a.attendend == 0)
            row.payment_status = amountPaid >= Number(row.price) ? 'complete' : 'incomplete'
            row.attendance_status = attendance ? 'incomplete' : 'complete'
            row.full_name = row.first_name + ' ' + row.last_name
        })

        // filter name
        if (filters.student_string) {
            plainData.rows = plainData.rows.filter( d => d.full_name.toLowerCase().includes(filters.student_string.toLowerCase()))
        }

        // filter status
        if (filters.payment_status) {
            plainData.rows = plainData.rows.filter( d => d.payment_status == filters.payment_status)
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

module.exports = studentsQueries