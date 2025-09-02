const domain = require("../../data/domain")
const fetch = require('node-fetch')
const plCategoriesQueries = require("../../dbQueries/courses/plCategoriesQueries")

const professionalLicencesController = {

    types: async(req,res) => {
        try{

            // define course type
            const alias = ['LP']
            const courseType =  await (await fetch(`${domain}get/courses/types?alias=${JSON.stringify(alias)}`)).json()
            req.session.courseType = courseType[0]

            return res.render('inscriptions/plTypes',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setTypes: async(req,res) => {
        try{

            const data = req.body
            const types = Object.keys(data)
            
            req.session.types = types

            // redirect
            return res.redirect('/inscripciones/licencias-profesionales/cursos')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    courses: async(req,res) => {
        try{

            const types = req.session.types
            const idCoursesTypes = req.session.courseType.id
            const courses = []

            const coursesData = await (await fetch(`${domain}get/courses?type_alias=${JSON.stringify(types)}&id_courses_types=${JSON.stringify(idCoursesTypes)}&enabled=1`)).json()

            types.forEach(type => {
                courses.push({
                    type_alias:type,
                    type: coursesData.find( c => c.type_alias == type).type,
                    type_action: coursesData.find( c => c.type_alias == type).type_action,
                    courses: coursesData.filter( c => c.type_alias == type)
                })                
            })

            const categories = await plCategoriesQueries.get({filters:{enabled:1}})

            return res.render('inscriptions/plSelectCourses',{title:'FEVB - Inscripciones',courses,categories})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = professionalLicencesController

