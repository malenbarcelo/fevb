
const studentsQueries = require("../dbQueries/students/studentsQueries")
const gf = require("../utils/generalFunctions")

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
    }
}

module.exports = cronController

