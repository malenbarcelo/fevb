
const studentsQueries = require("../dbQueries/students/studentsQueries")
const studentsAttendanceQueries = require("../dbQueries/students/studentsAttendanceQueries")
const studentsPaymentsQueries = require("../dbQueries/students/studentsPaymentsQueries")
const gf = require("../utils/generalFunctions")
const { getInscriptionsData } = require("../utils/postGSdata")
const branchesQueries = require("../dbQueries/branches/branchesQueries")
const domain = require("../data/domain")

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

            console.log('Updating students...')

            //if (!domain.includes('localhost')) {
                const branches = await branchesQueries.get({filters:{enabled:1}})
                const spreadsheets = branches.map( b => b.spreadsheet_id)
                const data = []

                for (const ss of spreadsheets) {
                    const ssData = await getInscriptionsData(ss)
                    data.push(...ssData)
                }

                const disabledStudents = data.filter( d => d[5] == 'si')
                const enabledStudents = data.filter( d => d[5] != 'si')
                const paid = data.filter( d => d[3] == 'si' && d[5] != 'si')       

                // disable students
                const studentsToDisable = []
                disabledStudents.forEach(s => {
                    studentsToDisable.push({
                        id: Number(s[0]),
                        dataToUpdate:{enabled:0}
                    })
                })

                await studentsQueries.update('id',studentsToDisable)            

                // enable student
                const studentsToEnable = []
                enabledStudents.forEach(s => {
                    studentsToEnable.push({
                        id: Number(s[0]),
                        dataToUpdate:{enabled:1}
                    })
                })

                await studentsQueries.update('id',studentsToEnable)

                // update attendance
                const idsToAttend = data
                    .filter(d => d[4] == 'si' && d[5] != 'si')
                    .map(d => Number(d[0]))

                const idsToUnattend = data
                    .filter(d => d[4] != 'si' || d[5] == 'si')
                    .map(d => Number(d[0]))            

                await studentsAttendanceQueries.bulkUpdate('id_students',{attended:1},idsToAttend)
                await studentsAttendanceQueries.bulkUpdate('id_students',{attended:0},idsToUnattend)
                await studentsQueries.bulkUpdate('id',{attendance_status:'complete'},idsToAttend)
                await studentsQueries.bulkUpdate('id',{attendance_status:'incomplete'},idsToUnattend)                

                // create payments
                const paymentsToCreate = paid.map(d => ({
                    id_students: d[0],
                    amount: Number(d[6].replace(/,/g, ''))
                }))
                const idsPaymentsToCreate = paymentsToCreate.map(p => p.id_students)

                await studentsPaymentsQueries.create(paymentsToCreate, false)
                await studentsQueries.bulkUpdate('id',{payment_status:'complete'},idsPaymentsToCreate)

                // delete payments
                const paymentsToDelete = disabledStudents.map(s => Number(s[0]))
                await studentsPaymentsQueries.destroy('id_students',paymentsToDelete)
                await studentsQueries.bulkUpdate('id',{payment_status:'incomplete'},paymentsToDelete)
            //}

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

