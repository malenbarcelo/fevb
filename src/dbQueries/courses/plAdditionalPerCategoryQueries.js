const db = require('../../../database/models')
const model = db.Pl_additional_per_category

const additionPerCategoryQueries = {
    get: async() => {

        const data = await model.findOne({
            order:[["id","DESC"]],
            raw: true
        })

        return data
    },
}

module.exports = additionPerCategoryQueries