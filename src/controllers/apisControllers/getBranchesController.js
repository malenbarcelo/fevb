const branchesQueries = require("../../dbQueries/branches/branchesQueries")

const getBranchesController = {
    branches: async(req,res) =>{
        try{

            const { id, order, enabled } = req.query
            
            const filters = {}

            // add filters
            if (id) {
                filters.id = id
            }

            if (enabled) {
                filters.enabled = JSON.parse(enabled)
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            const data = await branchesQueries.get({filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
    
}
module.exports = getBranchesController

