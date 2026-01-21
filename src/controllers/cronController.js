
const studentsQueries = require("../dbQueries/students/studentsQueries")
const studentsAttendanceQueries = require("../dbQueries/students/studentsAttendanceQueries")
const studentsPaymentsQueries = require("../dbQueries/students/studentsPaymentsQueries")
const gf = require("../utils/generalFunctions")
const { getInscriptionsData } = require("../utils/postGSdata")

const cronController = {

    createMoodleUsers: async(req,res) => {
        try {

            const moodleData = new URLSearchParams()

            const filters = {
                enabled: 1,
                user_name: 'null',
                courses_methodology: 'async',
                payment_status: 'complete'
            }

            let usersToCreate = await studentsQueries.get({ undefined, undefined, filters})
            usersToCreate = usersToCreate.rows

            const password = gf.randomString(10)

            console.log(password)

            // moodle data
            moodleData.append('wstoken', 'e6ff6de4ce5595ae34fe6fadcba2aca8')
            moodleData.append('wsfunction', 'core_user_create_users')
            moodleData.append('moodlewsrestformat', 'json')
            moodleData.append('users[0][username]', 'barcelomalenxy')
            moodleData.append('users[0][password]', password)
            moodleData.append('users[0][firstname]', 'Malen')
            moodleData.append('users[0][lastname]', 'Barcelo')
            moodleData.append('users[0][email]', 'barcelomalenxy@gmail.com')

            const response = await fetch('https://schemasim.com/moodle45/moodle/webservice/rest/server.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: moodleData.toString()
            })

            const responseData = await response.json()

            console.log(responseData)

            // // add users
            // usersToCreate.forEach(user => {

            //     const password = gf.randomString(10)

            //     moodelData.users.push({
            //         'username': 'malenbarceloxxx',
            //         'password': password,
            //         'firstname': user.first_name,
            //         'lastname': user.last_name,
            //         'email': 'malenbarceloxxx@gmail.com'
            //     })  
            // })

            // console.log(moodelData)



            // usersToCreate.forEach(user => {
            //     moodelData.users.push({
            //         "user_name": user.email,
            //         "password": "prueba123M",
            //         "firstname": user.first_name,
            //         "lastname":  user.last_name,
            //         "emails": user.email
            //     })                
            // })

            

                

        }catch (error) {
             console.log(error)
        }
    },

    updateStudents: async(req,res) => {
        try {

            const data = await getInscriptionsData()

            const elementsToDisable = data.filter( d => d[5] == 'si')
            const elementsToEnable = data.filter( d => d[5] == 'si')
            const examsToEnable = data.filter( d => d[6] == 'si')            

            // disable elements to delete
            const studentsToDisable = []
            elementsToDisable.forEach(e => {
                studentsToDisable.push({
                    id: Number(e[0]),
                    dataToUpdate:{enabled:0}
                })
            })

            await studentsQueries.update('id',studentsToDisable)

            // enable student
            const studentsToEnable = []
            elementsToEnable.forEach(e => {
                studentsToEnable.push({
                    id: Number(e[0]),
                    dataToUpdate:{enabled:1}
                })
            })

            await studentsQueries.update('id',studentsToEnable)

            ////// enable exams
            // attendance
            const attendanceToUpdate = []
            examsToEnable.forEach(e => {
                attendanceToUpdate.push({
                    id_students: Number(e[0]),
                    dataToUpdate: { attended: 1 }
                })                
            })
            
            await studentsAttendanceQueries.update('id_students',attendanceToUpdate)

            // payment
            const paymentsToCreate = []
            examsToEnable.forEach(e => {
                paymentsToCreate.push({
                    id_students: Number(e[0]),
                    amount: Number(e[7])
                })                
            })
            
            await studentsPaymentsQueries.create(paymentsToCreate, false)
                

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

