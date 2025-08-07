const typesQueries = require("../../dbQueries/professionalLicences/typesQueries")
const categoriesQueries = require("../../dbQueries/professionalLicences/categoriesQueries")
const typesCategoriesPricesQueries = require("../../dbQueries/professionalLicences/typesCategoriesPricesQueries")
const additionalPerCategoryQueries = require("../../dbQueries/professionalLicences/additionalPerCategoryQueries")
const studentsQueries = require("../../dbQueries/professionalLicences/studentsQueries")
const df = require("../../functions/datesFuntions")

const getPlController = {
    types: async(req,res) =>{
        try{

            const { id } = req.query
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = id
            }

            //get data
            const data = await typesQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    categories: async(req,res) =>{
        try{

            const { id } = req.query
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = id
            }

            //get data
            const data = await categoriesQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    typesCategoriesPrices: async(req,res) =>{
        try{

            const { id } = req.query
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = id
            }

            //get data
            const data = await typesCategoriesPricesQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    addionalPerCategory: async(req,res) =>{
        try{

            //get data
            const data = await additionalPerCategoryQueries.get()

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    students: async(req,res) =>{
        try{

            const { id, cuit, weeks_to_show } = req.query
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = id
            }

            if (cuit) {
                filters.cuit = cuit
            }

            if (weeks_to_show) {
                const weeks = df.weeksToShow()
                filters.weeks = weeks
            }

            //get data
            const data = await studentsQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getPlController

