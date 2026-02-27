const {validationResult} = require('express-validator')
const usersQueries = require("../dbQueries/users/usersQueries")

const mainController = {
    // main
    main: (req,res) => {
        try{            
            req.session.destroy()
            return res.redirect('/login')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // login
    login: (req,res) => {
        try{
            return res.render('login',{title:'FEVB - Login'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // login process
    loginProcess: async(req,res) => {
        try{

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Login'
                })
            }

            // login
            const userToLogin = await usersQueries.get({filters:{user_name:req.body.userName}})
            
            req.session.userLogged = userToLogin[0]
            delete req.session.userLogged.password

            return res.redirect('/menu')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // logout
    logout: (req,res) => {
        try{
            req.session.destroy()
            return res.redirect('/')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // main meu
    mainMenu: (req,res) => {
        try{            
            return res.render('mainMenu',{title:'FEVB - Menú principal'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}
module.exports = mainController

