

const datesFunctions = require("../../functions/datesFuntions")

const datesController = {
    
    getWeekAndDay: async(req,res) =>{
        try{

            const date = new Date()
            const data = datesFunctions.getWeekNumber(date)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    getWeeksInYear: async(req,res) =>{
        try{

            const { year } = req.query

            const data = datesFunctions.getWeeksInYear(year)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    getLastNweeks: async(req,res) =>{
        try{

            let { weeks } = req.query

            if (!weeks) {
                weeks = 8
            }

            const weeksToShow = datesFunctions.getNweeks(weeks)

            res.status(200).json(weeksToShow)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = datesController

