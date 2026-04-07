
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

                // classify data in a single loop
                const idsToDisable = []
                const idsToEnable = []
                const idsToAttend = []
                const idsToUnattend = []
                const paymentsToCreate = []

                for (const d of data) {
                    const id = Number(d[0])
                    if (d[5] == 'si') {
                        idsToDisable.push(id)
                        idsToUnattend.push(id)
                    } else {
                        idsToEnable.push(id)
                        if (d[4] == 'si') idsToAttend.push(id)
                        else idsToUnattend.push(id)
                        if (d[3] == 'si') {
                            paymentsToCreate.push({ id_students: id, amount: Number(d[6].replace(/,/g, '')) })
                        }
                    }
                }

                // update enabled/disabled
                if (idsToDisable.length > 0) await studentsQueries.bulkUpdate('id',{enabled:0},idsToDisable)
                if (idsToEnable.length > 0) await studentsQueries.bulkUpdate('id',{enabled:1},idsToEnable)

                // update attendance
                if (idsToAttend.length > 0) {
                    await studentsAttendanceQueries.bulkUpdate('id_students',{attended:1},idsToAttend)
                    await studentsQueries.bulkUpdate('id',{attendance_status:'complete'},idsToAttend)
                }
                if (idsToUnattend.length > 0) {
                    await studentsAttendanceQueries.bulkUpdate('id_students',{attended:0},idsToUnattend)
                    await studentsQueries.bulkUpdate('id',{attendance_status:'incomplete'},idsToUnattend)
                }

                // create payments
                if (paymentsToCreate.length > 0) {
                    const idsPaymentsToCreate = paymentsToCreate.map(p => p.id_students)
                    await studentsPaymentsQueries.create(paymentsToCreate, false)
                    await studentsQueries.bulkUpdate('id',{payment_status:'complete'},idsPaymentsToCreate)
                }

                // delete payments for disabled students
                if (idsToDisable.length > 0) {
                    await studentsPaymentsQueries.destroy('id_students',idsToDisable)
                    await studentsQueries.bulkUpdate('id',{payment_status:'incomplete'},idsToDisable)
                }
            //}

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

