const domain = require("../../data/domain")

const inscriptionsController = {
    mainMenu: async(req,res) => {
        try{

            const coursesTypes = await (await fetch(`${domain}get/courses/types?enabled=1&order=[["type","ASC"]]`)).json()

            return res.render('inscriptions/mainMenu',{title:'FEVB - Inscripciones',coursesTypes})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setCourseType: async(req,res) => {
        try{

            const urls = [
                {idCoursesTypes: 1,url: '/inscriptions/professional-licences/select-type'},
                {idCoursesTypes: 2,url: '/inscriptions/hazardous-materials/sworn-declaration'},
                {idCoursesTypes: 3,url: '/inscriptions/defensive-driving/select-course'},                
            ]

            const data = req.body

            const redirection = urls.find(url => url.idCoursesTypes == req.body.typeButton).url
            
            req.session.courseType = parseInt(data.typeButton)

            // redirect
            return res.redirect(redirection)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    schedule: async(req,res) => {
        try{

            // get data
            const price = req.session.price

            const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options?id_courses=${req.session.idCourses}`)).json()
            
            return res.render('inscriptions/schedule',{title:'FEVB - Cargas Peligrosas',scheduleOptions,price})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = inscriptionsController

