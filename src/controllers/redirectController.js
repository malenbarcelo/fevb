const {validationResult} = require('express-validator')
const usersQueries = require("../dbQueries/users/usersQueries")

const redirectController = {
    
    plRedirect: async(req,res) => {
        try{

            return res.redirect(`/inscripciones/neuquen/licencias-profesionales`)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = redirectController

