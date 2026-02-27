const branchesQueries = require("../dbQueries/branches/branchesQueries")

const mainController = {
    
    // menu
    menu: (req,res) => {
        try{
            return res.render('admin/menu',{title:'FEVB - Administración'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // async students
    asyncStudents: (req,res) => {
        try{
            return res.render('admin/asyncStudents/asyncStudents',{title:'FEVB - Administración'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // sync students
    syncStudents: async(req,res) => {
        try{
            const branches = await branchesQueries.get({filters:{enabled:1}})
            return res.render('admin/syncStudents/syncStudents',{title:'FEVB - Administración',branches})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = mainController

