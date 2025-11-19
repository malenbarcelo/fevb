const gf = require("../../functions/generalFunctions")

const examsController = {
    
    getExamImages: async(req,res) =>{
        try{

            const {courseType, examFiles} =  await gf.getExamImages(req)

            res.status(200).json({folder:courseType,files:examFiles})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    getExamAction: async(req,res) =>{
        try{

            const action = req.session.studentLogged.action

            res.status(200).json(action)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = examsController

