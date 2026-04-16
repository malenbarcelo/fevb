const branchesQueries = require("../dbQueries/branches/branchesQueries")

const mainController = {
    
    menu: (req,res) => {
        try{
            return res.render('admin/menu',{title:'FEVB - Administración'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    asyncStudents: (req,res) => {
        try{
            return res.render('admin/asyncStudents/asyncStudents',{title:'FEVB - Administración'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    syncStudents: async(req,res) => {
        try{
            const branches = await branchesQueries.get({filters:{enabled:1}})
            return res.render('admin/syncStudents/syncStudents',{title:'FEVB - Administración',branches})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    exams: async(req,res) => {
        try{
            
            return res.render('admin/exams/exams',{title:'FEVB - Administración'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    syncCourses: async(req,res) => {
        try{
            
            return res.render('admin/syncCourses/syncCourses',{title:'FEVB - Administración'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = mainController

