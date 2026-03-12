const gf = require("../../utils/generalFunctions")

const examsController = {
    
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

