
const df = require("../../functions/datesFuntions")
const domain = require("../../data/domain")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const datesQueries = require("../../dbQueries/courses/datesQueries")
const ciuScheduleQueries = require("../../dbQueries/courses/ciuScheduleQueries")
const fetch = require('node-fetch')
const scheduleQueries = require("../../dbQueries/courses/scheduleQueries")
const shiftsDescriptionsQueries = require("../../dbQueries/courses/shiftsDescriptionsQueries")

const coursesController = {
    getScheduleOptions: async(req,res) =>{
        try{

            const { id_courses } = req.query

            const shiftsDescriptions = await shiftsDescriptionsQueries.get({filters:{}})

            const idCourses = id_courses ? JSON.parse(id_courses) : [...new Set(req.session.coursesData.map( cd => cd.id))] // from backend I cant get req.session

            // get courses data
            const coursesData = await coursesQueries.get({filters:{id:idCourses}})

            // get enabled days
            const date = new Date()
            const year = date.getFullYear()
            const years = [year-1, year, year+1]
            let unabledDates = await datesQueries.get({filters:{years:years,enabled:0}})
            unabledDates = unabledDates.map( ud => ud.date_string + '/' + ud.year)

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

            // get array with duration hours
            let shiftsDurations = schedule.map(({ day, day_shift, duration_hours }) => ({
                day,
                day_shift,
                duration_hours
            }))
            .filter((item, index, self) => // eliminate duplicates
                index === self.findIndex(
                t =>
                    t.day === item.day &&
                    t.day_shift === item.day_shift &&
                    t.duration_hours === item.duration_hours
                )
            )

            // show only shifts data
            const exclude = ['id', 'id_courses','course_description','classroom_alias','enabled','duration_hours']

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

            // add CIU schedule if applies
            const includesCIU = coursesData.find(c => c.ciu == 1)

            if (includesCIU) {
                let ciuSchedule = await ciuScheduleQueries.get({filters:{year_week:mapWeeksToShow}})
                
                // show only shifts data
                const exclude = ['id', 'enabled','day_hours']

                ciuSchedule = ciuSchedule.map(s => {
                    const newObj = { ...s }
                    exclude.forEach(key => delete newObj[key])
                    return newObj
                })

                const ciuShiftsDurations = ciuSchedule.map(({ day, day_shift, duration_hours }) => ({
                    day,
                    day_shift,
                    duration_hours
                }))
                .filter((item, index, self) => // eliminate duplicates
                    index === self.findIndex(
                    t =>
                        t.day === item.day &&
                        t.day_shift === item.day_shift &&
                        t.duration_hours === item.duration_hours
                    )
                )

                shiftsDurations = [...ciuShiftsDurations, ...shiftsDurations]
                schedule = [...ciuSchedule, ...schedule]

            }

            // sum duration_hours per day
            shiftsDurations = Object.values(
                shiftsDurations.reduce((acc, { day, duration_hours }) => {
                    acc[day] = acc[day] || { day, total_hours: 0 }
                    acc[day].total_hours += duration_hours
                    return acc
                }, {})
            )

            // show only corresdponding week type if applies
            const weeksTypes = [...new Set(schedule.map( s => s.weeks))]
            if (weeksTypes.includes('odd')) {
                schedule = schedule.filter( s => s.week_number % 2 == 0)
            }
            if (weeksTypes.includes('even')) {
                schedule = schedule.filter( s => s.week_number % 2 != 0)
            }
            
            const commissions = [...new Set(schedule.map(c => c.commission_number))]

            // standarize data
            let scheduleOptions = []
            let idCounter = 1
            mapWeeksToShow.forEach(w => {
                
                commissions.forEach(c => {

                    let shifts = schedule.filter(s => s.year_week == w && s.commission_number == c)
                    shifts.forEach(s => {
                        s.complete_date = s.date_string + '/' + s.year
                        s.unabledDate = unabledDates.includes(s.complete_date)
                    });

                    if (shifts.length > 0) {

                        const days = [...new Set(shifts.map(s => s.day))]

                        // add days shifts
                        const daysShifts = []
                        days.forEach(d => {

                            
                            const filterShifts = shifts.filter( s => s.day == d)
                            const shiftAlias = filterShifts.length === 2 
                                ? 'MT' 
                                : filterShifts[0]?.shift_alias                            
                            
                            const shiftDescription =  shiftsDescriptions.find( s => s.shift_alias == shiftAlias)

                            daysShifts.push({
                                day: d,
                                dayNumber: filterShifts.find(s => s.day == d).day_number,
                                shiftDescription: shiftDescription.description,
                                shifts: filterShifts,
                                duration: shiftsDurations.find( sd => sd.day == d).total_hours
                            })
                        })

                        // shift description
                        let shiftsDescriptionArray = []
                        daysShifts.forEach(shift => {
                            shiftsDescriptionArray.push(shift.day.slice(0, 2) + ' ' + shift.shifts[0].date_string)
                        })
                        const shiftsDescription = shiftsDescriptionArray.join(' y ')

                        // complete schedule options
                        scheduleOptions.push({
                            id: idCounter++,
                            week_number: parseInt(w.split('_')[1]),
                            year: parseInt(w.split('_')[0]),
                            year_week: w,
                            commission_number: c,
                            shifts,
                            daysShifts: daysShifts,
                            shiftsDescription: shiftsDescription
                        })
                    }
                })
            })

            // filter dates if applies            
            scheduleOptions = scheduleOptions.filter( s => s.week_number > weekNumber || (s.week_number == weekNumber && s.shifts[0].day_number > dayNumber) )

            // delete unabled dates
            scheduleOptions = scheduleOptions.filter( s => s.shifts.filter( sh => sh.unabledDate == true).length == 0)

            // eliminate duplicates
            let options = []
            scheduleOptions.forEach(option => {
                const findElement = options.filter( so => so.shiftsDescription == option.shiftsDescription)
                if (findElement.length == 0) {

                    options.push(option)
                }
            })
            
            res.status(200).json(options)

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
    }
}
module.exports = coursesController

