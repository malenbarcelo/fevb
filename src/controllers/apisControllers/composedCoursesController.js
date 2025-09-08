
const df = require("../../functions/datesFuntions")
const domain = require("../../data/domain")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const fetch = require('node-fetch')
const scheduleQueries = require("../../dbQueries/courses/scheduleQueries")
const shiftsDescriptionsQueries = require("../../dbQueries/courses/shiftsDescriptionsQueries")


const coursesController = {
    getScheduleOptions: async(req,res) =>{
        try{

            const { id_courses } = req.query

            const shiftsDescriptions = await shiftsDescriptionsQueries.get({filters:{}})

            const idCourses = id_courses ? JSON.parse(id_courses) : [...new Set(req.session.coursesData.map( cd => cd.id))] // from backend I cant get req.session

            // gte weeks to show
            const weeksToShow = df.weeksToShow()
            const mapWeeksToShow = weeksToShow.map( wts => wts.year + '_' + wts.week_number)
            const {weekNumber,dayNumber} = df.getWeekNumber(new Date())
            
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

            // eliminate duplicates
            schedule = [
                ...new Map(
                    schedule.map(s => [s.day_shift + '_' + s.commission_number + '_' + s.date_string, s])
                ).values()
            ]

            // show only corresdponding week type if applies
            const weeksTypes = [...new Set(schedule.map( s => s.weeks))]
            if (weeksTypes.includes('odd')) {
                schedule = schedule.filter( s => s.week_number % 2 == 0)
            }
            if (weeksTypes.includes('even')) {
                schedule = schedule.filter( s => s.week_number % 2 != 0)
            }

            // filter commission 2 if only E2 or 'Obtención' (GOD LEVEL HARDCODING)
            const coursesData = await coursesQueries.get({filters:{id:idCourses}})
            const categories = [...new Set(coursesData.map( cd => cd.category))]
            const typesAlias = [...new Set(coursesData.map( cd => cd.type_alias))]
            const courseName = [...new Set(coursesData.map( cd => cd.course_name))]
            const notE2 = categories.filter( c => c != 'E2')
            const typeO = typesAlias.filter( t => t == 'O')
            if (courseName.includes('Licencia Profesional de Conducir') && (notE2.length == 0 || typeO.length != 0)) {
                schedule = schedule.filter( s => s.commission_number == 1)
            }
            
            const commissions = [...new Set(schedule.map(c => c.commission_number))]

            // standarize data
            let scheduleOptions = []
            let idCounter = 1
            mapWeeksToShow.forEach(w => {
                commissions.forEach(c => {

                    let shifts = schedule.filter(s => s.year_week == w && s.commission_number == c)

                    if (shifts.length > 0) {

                        const days = [...new Set(shifts.map(s => s.day))]

                        // add days shifts
                        const daysShifts = []
                        days.forEach(d => {
                            const filterShifts = shifts.filter( s => s.day == d)
                            const shiftAlias = filterShifts.length == 2 ? 'MT' : 'M'
                            const shiftDescription =  shiftsDescriptions.find( s => s.shift_alias == shiftAlias)

                            daysShifts.push({
                                day: d,
                                dayNumber: filterShifts.find(s => s.day == d).day_number,
                                shiftDescription: shiftDescription.description,
                                shifts: filterShifts
                            })
                        })

                        // complete schedule options
                        scheduleOptions.push({
                            id: idCounter++,
                            week_number: parseInt(w.split('_')[1]),
                            year: parseInt(w.split('_')[0]),
                            year_week: w,
                            commission_number: c,
                            shifts,
                            daysShifts:daysShifts
                        })
                    }
                })
            })

            // filter dates if applies            
            scheduleOptions = scheduleOptions.filter( s => s.week_number > weekNumber || (s.week_number == weekNumber && s.shifts[0].day_number > dayNumber) )

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

