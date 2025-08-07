const { weeksToShow } = require("../functions/datesFuntions")
const datesQueries = require("../dbQueries/professionalLicences/datesQueries.js")

const mainController = {
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
            return res.render('mainMenu',{title:'FEVB - Menú principal'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // main menu
    mainMenu: (req,res) => {
        try{
            return res.render('mainMenu',{title:'FEVB - Menú principal'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // attendance
    attendance: async(req,res) => {
        try{
            
            const options = weeksToShow()

            // add data
            for (let i = 0; i < options.length; i++) {
                const filters = {week_number:options[i].week_number, year: options[i].year, day_number: 2}
                const weekData = await datesQueries.get({filters})
                options[i].date_string = weekData[0].date_string                
                options[i].description = 'Semana ' + options[i].week_number + ' - Lunes ' + weekData[0].date_string + '/' + options[i].year
                
            }
            return res.render('attendance/attendance',{title:'FEVB - Asistencia',options})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = mainController

