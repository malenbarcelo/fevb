const domain = require("../../data/domain")
const fetch = require('node-fetch')

const hazardousMaterialsController = {

    hmSwornDeclaration: (req,res) => {
        try{
            const branchAlias = req.session.branch.branch_alias

            return res.render('inscriptions/hmSwornDeclaration',{title:'FEVB - Inscripciones', branchAlias})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setSwornDeclaration: async(req,res) => {
        try{

            const data = req.body
            const branchAlias = req.session.branch.branch_alias
            const keys = Object.keys(data)
            const idCourses = keys.includes('check_cde') ? 1 : 2
            const price = await (await fetch(`${domain}get/courses/prices?id_courses=[${idCourses}]&order=[["id","DESC"]]`)).json()
            const courseData = await (await fetch(`${domain}get/courses?id=[${idCourses}]&enabled=1`)).json()
            
            req.session.coursesData = courseData
            req.session.price = parseFloat(price[0].price)

            // redirect
            return res.redirect(`/inscripciones/${branchAlias}/cronograma`)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = hazardousMaterialsController

