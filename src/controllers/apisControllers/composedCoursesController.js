
const df = require("../../functions/datesFuntions")
const domain = require("../../data/domain")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const fetch = require('node-fetch')
const scheduleQueries = require("../../dbQueries/courses/scheduleQueries")

const coursesController = {
    getScheduleOptions: async(req,res) =>{
        try{

            const { id_courses } = req.query

            const idCourses = id_courses ? JSON.parse(id_courses) : [...new Set(req.session.coursesData.map( cd => cd.id))] // from backend I cant get req.session

            // gte weeks to show
            const weeksToShow = df.weeksToShow()
            const mapWeeksToShow = weeksToShow.map( wts => wts.year + '_' + wts.week_number)
            
            // get schedule
            const filters = {
                id_courses: idCourses,
                year_week: mapWeeksToShow,
                enabled: 1,
                order: [["day_number","ASC"],["shift_alias","ASC"]]
            }

            let schedule = await scheduleQueries.get({filters})

            // show only shifts data
            const exclude = ['id', 'id_courses','course_description','classroom_alias','enabled']

            schedule = schedule.map(s => {
                const newObj = { ...s }
                exclude.forEach(key => delete newObj[key])
                return newObj
            })

            schedule = [...new Set(schedule)]

            // findout if E2 was selected ///// god level harcodation ////
            // solo muestro comision 2 para mandar a todos a miercoles o jueves en caso de elegir otra categoria que no sea E2
            // solo muestro semanas impares que es cuando se dicta E2
            const coursesData = await coursesQueries.get({filters:{id:idCourses}})
            const findE2 = coursesData.filter( c => c.category == 'E2')
            const typeAlias = findE2.find( e2 => e2.type_alias == 'O')
            //const commissions = findE2.length > 0 ? (typeAlias ? [1] : [2]) : [...new Set(schedule.map(c => c.commission_number))]
            const commissions = [...new Set(schedule.map(c => c.commission_number))]
            if (findE2.length > 0) {
                schedule = schedule.filter( s => s.day_number != 2 && s.day_number != 3 && s.week_number % 2 != 0)                
            }            

            // standarize data
            const scheduleOptions = []
            let idCounter = 1
            mapWeeksToShow.forEach(w => {
                commissions.forEach(c => {

                    const shifts = schedule.filter(s => s.year_week == w && s.commission_number == c)

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
                            year: w.year,
                            commission_number: c,
                            shifts,
                            daysShifts:daysShifts
                        })
                    }
                })
            })

            //console.log(scheduleOptions)

            res.status(200).json(scheduleOptions)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    getSession: async(req,res) =>{
        try{

            const data = req.session

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = coursesController

