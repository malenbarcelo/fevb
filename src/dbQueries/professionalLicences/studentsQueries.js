const db = require('../../../database/models')
const { Op } = require('sequelize') 
const model = db.Pl_students

const studentsQueries = {
    get: async({ filters }) => {

        // order
        let order = {}
        if (filters.order) {
            order = filters.order
        }

        // where
        const andConditions = []

        if (filters.id) {
            andConditions.push({ id: filters.id })
        }

        if (filters.cuit) {
            andConditions.push({ cuit: filters.cuit })
        }

        if (filters.commission_number) {
            andConditions.push({ commission_number: filters.commission_number })
        }

        if (filters.week_number) {
            andConditions.push({ week_number: filters.week_number })
        }

        if (filters.year) {
            andConditions.push({ year: filters.year })
        }

        // add week and year condition
        if (filters.weeks) {
            const orWeeks = filters.weeks.map(w => ({
                week_number: w.week_number,
                year: w.year
            }))
            andConditions.push({ [Op.or]: orWeeks })
        }

        const where = andConditions.length > 0 ? { [Op.and]: andConditions } : {}

        const data = await model.findAll({            
            include: [                
                {
                    association: 'selection',
                    include: [
                        {association: 'type_data'},
                        {association: 'category_data'}
                    ]
                },
                {
                    association: 'attendance',
                }
            ],
            where,
            nest:true
        })

        const plainData = data.map(d => d.get({ plain: true }))

        return plainData
    },
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },
}

module.exports = studentsQueries