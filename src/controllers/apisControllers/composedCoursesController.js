
const df = require("../../functions/datesFuntions")
const domain = require("../../data/domain")

const coursesController = {
    getScheduleOptions: async(req,res) =>{
        try{

            const { id_courses } = req.query

            console.log(id_courses)

            const weeksToShow = df.weeksToShow()
            const mapWeekToShow = weeksToShow.map( wts => wts.year + '_' + wts.week_number)
            const stringWeeksToShow = mapWeekToShow.map( mwts => '"' + mwts + '"')
            let filters = 'id_courses=' + id_courses
            filters += '&year_week=[' + stringWeeksToShow + ']'
            filters += '&enabled=1'
            filters += '&order=[["id_courses","ASC"],["week_number","ASC"],["day_number","ASC"]]'
            const schedule = await (await fetch(`${domain}get/courses/schedule?${filters}`)).json()
            const commissions = [...new Set(schedule.map(c => c.commission_number))]

            console.log(`${domain}get/courses/schedule?${filters}`)
            
            // standarize data
            const scheduleOptions = []
            let idCounter = 1
            weeksToShow.forEach(w => {
                commissions.forEach(c => {

                    const shifts = schedule.filter(s => s.week_number == w.week_number && s.commission_number == c)                    

                    if (shifts.length > 0) {

                        const days = [...new Set(shifts.map(s => s.day))]

                        // add days shifts
                        const daysShifts = []
                        days.forEach(d => {
                            daysShifts.push({
                                day: d,
                                shifts: shifts.filter( s => s.day == d)
                            })
                        })

                        // complete schedule options
                        scheduleOptions.push({
                            id: idCounter++,
                            week_number: w.week_number,
                            commission_number: c,
                            shifts,
                            daysShifts:daysShifts
                        })
                    }
                })
            })

            res.status(200).json(scheduleOptions)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = coursesController

