const db = require('../../../database/models')
const model = db.Users

const studentsExamsQueries = {
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
        
        if (filters.user_name) {
            where.user_name = filters.user_name
        }  
        
        const data = await model.findAll({            
            where,
            raw:true
        })

        return data
    }
}

module.exports = studentsExamsQueries