
const studentsQueries = require("../dbQueries/students/studentsQueries")
const domain = require("../data/domain")

const cronController = {

    createMoodleUsers: async(req,res) => {
        try {

            const filters = {
                enabled: 1,
                created_user: 'no',
                courses_methodology: 'async'
            }

            let usersToCreate = await studentsQueries.get({ undefined, undefined, filters})
            usersToCreate = usersToCreate.rows

            const moodelData = {
                wstoken: 'e6ff6de4ce5595ae34fe6fadcba2aca8',
                wsfunction: 'core_user_create_users',
                moodlewsrestformat: 'json',
                users: []
            }

            usersToCreate.forEach(user => {
                moodelData.users.push({
                    "user_name": user.email,
                    "password": "prueba123M",
                    "firstname": user.name,
                    "lastname": "lasname",
                    "emails": user.email
                })                
            })

            const response = await fetch('https://schemasim.com/moodle45/moodle/webservice/rest/server.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(moodelData).toString()
            })

            const responseData = await response.json()

            console.log(responseData)


            

            console.log(moodelData)

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

