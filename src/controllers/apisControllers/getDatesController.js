const datesQueries = require("../../dbQueries/courses/datesQueries")

const getDatesController = {
    dates: async(req,res) =>{
        try{

            const { id, order, weeks_numbers, days_numbers, years_weeks, enabled } = req.query
            
            const filters = {}

            // add filters
            if (id) {
                filters.id = id
            }

            if (enabled) {
                filters.enabled = enabled
            }

            if (weeks_numbers) {
                filters.week_number = JSON.parse(weeks_numbers)
            }

            if (days_numbers) {
                filters.day_number = JSON.parse(days_numbers)
            }

            if (years_weeks) {
                filters.year_week = JSON.parse(years_weeks)
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            const data = await datesQueries.get({filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
    
}
module.exports = getDatesController

