const studentsQueries = require("../../dbQueries/students/studentsQueries")
const inscriptionsQueries = require("../../dbQueries/inscriptions/inscriptionsQueries")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const pricesQueries = require("../../dbQueries/courses/pricesQueries")
const studentsAttendanceQueries = require("../../dbQueries/students/studentsAttendanceQueries")
const branchesQueries = require("../../dbQueries/branches/branchesQueries")
const datesQueries = require("../../dbQueries/courses/datesQueries")

const { getBulkInscriptionsData, getBulkDataToPost, postData, deleteBulkData } = require("../../utils/postGSdata")
const { createExamsData } = require("../../utils/createExamsData")

const inscriptionsController = {
    
    syncBulkCreate: async(req,res) =>{
        try{

            const branchUrl = req.path.split('/')[1]
            const branchesData = await branchesQueries.get({filters:{enabled:1}})
            const spreadsheetId = branchesData.find( b => b.branch_url == branchUrl).spreadsheet_id

            // get spreadsheet data
            let data = await getBulkInscriptionsData(spreadsheetId)

            // get data
            const date = new Date()
            const year = date.getFullYear()
            const years = [year-1, year, year+1]
            const courses = await coursesQueries.get({filters:{enabled:1}})
            const dates = await datesQueries.get({filters:{years:years}})
            const prices = await pricesQueries.get({filters:{}})

            // function to get data from spreadsheet
            function getData(d) {

                // dates
                const firstDate = d.slice(5, 16).find(el => el !== '')
                const year = d[17]
                const day = firstDate.split('/')[0]
                const month = firstDate.split('/')[1]
                const weekNumber = dates.find(d => d.date_string == firstDate && d.year == year).week_number

                // courses
                const selectedCourses = d[18] == 'LP' ? d.slice(19, 42).filter( el => el != '') : [d[18]]                
                const coursesData = courses.filter(c => selectedCourses.includes(c.type_alias + '_' + c.category))
                const idsCourses = coursesData.map( cd => cd.id)

                return {day,month,year,weekNumber,idsCourses, coursesData}
                
            }

            // add courses to data
            data.forEach(d => {
                const { coursesData } = getData(d)
                d.coursesData = coursesData                
            })

            // inscriptions
            const inscriptions = []
            data.forEach(d => {
                inscriptions.push({
                    inscription_type: 'particular',
                    first_name: d[1],
                    last_name: d[2],
                    email: d[3],
                    phone_number: d[4]
                })
            })
            
            const createdInscriptions = await inscriptionsQueries.create(inscriptions)

            

            // complete data
            const students = []

            data.forEach((d,index) => {

                // get dates data
                const { day, month, year, weekNumber, idsCourses, coursesData } = getData(d)
                
                const commissionName = Number(year + month + day)
                
                // get courses data
                const selectedCoursesPrices = prices.filter( p => idsCourses.includes(p.id_courses))
                const maxPrice = Math.max(...selectedCoursesPrices.map(p => Number(p.price)))

                students.push({
                    id_inscriptions: createdInscriptions[index].id,
                    commission_name: commissionName,
                    cuit_cuil: Number(d[0]),
                    first_name: d[1],
                    last_name: d[2],
                    email: d[3],
                    phone_number: Number(d[4]),
                    year: Number(d[17]),
                    week_number: weekNumber,
                    year_week: year + '_' + weekNumber,
                    id_courses_types: coursesData[0].id_courses_types,
                    courses_methodology: 'sync',
                    price: maxPrice
                })

            })
            
            let createdStudents = await studentsQueries.create(students)

            // attendance
            let attendance = []

            data.forEach((d,index) => {

                // get dates data
                const { year, weekNumber } = getData(d)
                
                let dayNumber = 1
                
                for (let i = 5; i <= 16; i++) {

                    attendance.push({
                        id_students:createdStudents[index].id,
                        year:year,
                        week_number: weekNumber,
                        year_week: year + '_' + weekNumber,
                        date_string: d[i],
                        day_number: dayNumber,
                        shift_alias: i % 2 == 0 ? 'T' : 'M',
                        attended: 0
                    })

                    dayNumber = i % 2 == 0 ? (dayNumber + 1) : dayNumber
                }
            })

            attendance = attendance.filter( a => a.date_string != '')

            await studentsAttendanceQueries.create(attendance)

            // get students courses exams
            const studentsCoursesExams = []
            
            data.forEach((d,index) => {

                const { idsCourses } = getData(d)
                
                idsCourses.forEach(id => {
                    studentsCoursesExams.push({
                        id_students: createdStudents[index].id,
                        id_courses: id,
                        id_exams_theoricals: courses.find( c => c.id == id).id_exams_theoricals,
                        id_exams_practicals: courses.find( c => c.id == id).id_exams_practicals,

                    })
                })
            })

            // create students_exams, studenst_courses_exams, exams_theoricals_answers and exams_practicals_answers
            await createExamsData(studentsCoursesExams)

            // post data to google sheets
            const dataToPost = await getBulkDataToPost(createdStudents, data, dates)
            await postData(dataToPost, spreadsheetId)

            // delete data
            await deleteBulkData(spreadsheetId)

            res.status(200).json({response:'ok'})
            
        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    }
}

module.exports = inscriptionsController

