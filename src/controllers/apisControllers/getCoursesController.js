const typesQueries = require("../../dbQueries/courses/typesQueries")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const scheduleQueries = require("../../dbQueries/courses/scheduleQueries")
const pricesQueries = require("../../dbQueries/courses/pricesQueries")
const plAdditionalPerCategoryQueries = require("../../dbQueries/courses/plAdditionalPerCategoryQueries")

const getCoursesController = {
    types: async(req,res) =>{
        try{

            const { id, alias, enabled, order } = req.query
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = JSON.parse(id)
            }

            if (alias) {
                filters.alias = JSON.parse(alias)
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
    courses: async(req,res) =>{
        try{

            const { id, id_courses_types, category, alias, type_alias, enabled, order } = req.query
            
            const filters = {}
            
            // add filters
            if (id) {
                filters.id = JSON.parse(id)
            }

            if (id_courses_types) {
                filters.id_courses_types = JSON.parse(id_courses_types)
            }

            if (alias) {
                filters.alias = alias
            }

            if (type_alias) {
                filters.type_alias = JSON.parse(type_alias)
            }

            if (category) {
                filters.category = JSON.parse(category)
            }

            if (enabled) {
                filters.enabled = enabled
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            //get data
            const data = await coursesQueries.get({ filters })

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
                filters.id_courses = JSON.parse(id_courses)
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
    },
    addionalPerCategory: async(req,res) =>{
        try{

            //get data
            const data = await plAdditionalPerCategoryQueries.get()

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = getCoursesController

