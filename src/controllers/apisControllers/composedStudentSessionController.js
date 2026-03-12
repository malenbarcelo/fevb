const studentSessionController = {
    getSessionData: async(req,res) =>{
        try{

            let data = req.session.studentLogged

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:error})
        }
    },

    
}
module.exports = studentSessionController

