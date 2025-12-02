const { weeksToShow } = require("../functions/datesFuntions.js")
const datesQueries = require("../dbQueries/courses/datesQueries.js")

const adminController = {
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
    loginProcess: (req,res) => {
        try{
            return res.redirect('/menu')
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
    },
    // inscriptions management
    inscManagement: (req,res) => {
        try{
            return res.render('inscManagement/inscManagement',{title:'FEVB - Gestión de inscripciones'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}
module.exports = adminController

