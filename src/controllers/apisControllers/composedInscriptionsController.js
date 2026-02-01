const studentsQueries = require("../../dbQueries/students/studentsQueries")
const inscriptionsQueries = require("../../dbQueries/inscriptions/inscriptionsQueries")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const studentsAttendanceQueries = require("../../dbQueries/students/studentsAttendanceQueries")
const { getBulkInscriptionsData, getBulkDataToPost, postData, deleteBulkData } = require("../../utils/postGSdata")
const { createStudentsCoursesExamsAnswers } = require("../../utils/createStudentsCoursesExamsAnswers")

const inscriptionsController = {
    
    syncBulkCreate: async(req,res) =>{
        try{

            const data = await getBulkInscriptionsData()
            const courses = await coursesQueries.get({filters:{enabled:1}})

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

            // students
            const students = []
            data.forEach((d,index) => {
                students.push({
                    id_inscriptions: createdInscriptions[index].id,
                    commission_name: Number(d[17] + d[84].split('/')[1] + d[84].split('/')[0]),
                    cuit_cuil: Number(d[0]),
                    first_name: d[1],
                    last_name: d[2],
                    email: d[3],
                    phone_number: Number(d[4]),
                    year: Number(d[17]),
                    week_number: Number(d[83]),
                    year_week: d[17] + '_' + d[83],
                    id_courses_types: Number(d[85]),
                    price: Number(d[19]),
                    courses_methodology: 'sync'
                })
            })

            const createdStudents = await studentsQueries.create(students)

            // attendance
            let attendance = []
            data.forEach((d,index) => {

                let dayNumber = 1
                
                for (let i = 5; i <= 16; i++) {

                    attendance.push({
                        id_students:createdStudents[index].id,
                        year: Number(d[17]),
                        week_number: Number(d[83]),
                        year_week: d[17] + '_' + d[83],
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

            // get students courses
            const studentsCourses = []
            data.forEach((d,index) => {
                const idsCourses = d[110].split(',').map( id => Number(id))
                idsCourses.forEach(id => {
                    studentsCourses.push({
                        id_students: createdStudents[index].id,
                        id_courses: id,
                        id_exams_theoricals: courses.find( c => c.id == id).id_exams_theoricals,
                        id_exams_practicals: courses.find( c => c.id == id).id_exams_practicals,

                    })
                })
            })

            // create students_exams, studenst_courses_exams, exams_theoricals_answers and exams_practicals_answers
            await createStudentsCoursesExamsAnswers(studentsCourses)

            // post data to google sheets
            //const dataToPost = await getBulkDataToPost(createdStudents, data)
            //await postData(dataToPost)

            // delete data
            //await deleteBulkData()

            res.status(200).json({response:'ok'})
            
        }catch(error){
            console.log(error)
            res.status(200).json({response:'error'})
        }
    }
}
module.exports = inscriptionsController

