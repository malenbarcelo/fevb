const domain = require("../../data/domain")

const hazardousMaterialsController = {

    hmSwornDeclaration: (req,res) => {
        try{

            return res.render('inscriptions/hmSwornDeclaration',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setSwornDeclaration: async(req,res) => {
        try{

            const data = req.body
            const keys = Object.keys(data)
            const idCourses = keys.includes('check_cde') ? 1 : 2
            const price = await (await fetch(`${domain}get/courses/prices?id_courses=[${idCourses}]&order=[["id","DESC"]]`)).json()
            
            req.session.idCourses = idCourses
            req.session.price = parseFloat(price[0].price)

            // redirect
            return res.redirect('/inscriptions/schedule')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = hazardousMaterialsController

