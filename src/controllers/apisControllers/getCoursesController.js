const typesQueries = require("../../dbQueries/courses/typesQueries")
const scheduleQueries = require("../../dbQueries/courses/scheduleQueries")
const pricesQueries = require("../../dbQueries/courses/pricesQueries")

const getCoursesController = {
    types: async(req,res) =>{
        try{

            const { id, enabled, order } = req.query
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = id
            }

            if (enabled) {
                filters.enabled = enabled
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            //get data
            const data = await typesQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    schedule: async(req,res) =>{
        try{

            const { id_courses, year_week,enabled, order } = req.query
            const filters = {}
            
            // add filters
            if (id_courses) {
                filters.id_courses = id_courses
            }
            if (year_week) {
                filters.year_week = JSON.parse(year_week)
            }
            if (enabled) {
                filters.enabled = enabled
            }
            if (order) {
                filters.order = JSON.parse(order)
            }

            //get data
            const data = await scheduleQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    prices: async(req,res) =>{
        try{

            const { id_courses, order } = req.query
            const filters = {}
            
            // add filters
            if (id_courses) {
                filters.id_courses = JSON.parse(id_courses)
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            //get data
            const data = await pricesQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}
module.exports = getCoursesController

