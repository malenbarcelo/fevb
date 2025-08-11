const categoriesQueries = require("../dbQueries/professionalLicences/categoriesQueries.js")
const typesQueries = require("../dbQueries/professionalLicences/typesQueries.js")
const studentsQueries = require("../dbQueries/professionalLicences/studentsQueries.js")
const studentsTypesCategoriesQueries = require("../dbQueries/professionalLicences/studentsTypesCategoriesQueries.js")
const studentsAttendanceQueries = require("../dbQueries/professionalLicences/studentsAttendanceQueries.js")
const { getSchedule } = require("../functions/getSchedule.js")
const {transporterData, sendMail} = require("../functions/mail.js")

const professionalLicencesController = {
    // main menu
    mainMenu: (req,res) => {
        try{
            req.session.destroy()
            return res.render('professionalLicences/types',{title:'FEVB - Inscripciones'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // setType
    setType: async(req,res) => {
        try{

            const data = req.body
            const idsTypes = Object.keys(data)
            const filters = {ids:idsTypes}
            const typeData = await typesQueries.get({filters})
            req.session.types = typeData

            // redirect
            return res.redirect('/professional-licences/categories')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // categories
    categories: async(req,res) => {
        try{
            const types = req.session.types
            const filters = {enabled:1}
            const categories = await categoriesQueries.get({filters})
            return res.render('professionalLicences/categories',{title:'FEVB - Inscripciones',types,categories})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // setCategory
    setCategories: async(req,res) => {
        try{

            const data = req.body
            const types = await typesQueries.get({filters:{}})
            const categories = await categoriesQueries.get({filters:{}})
            const keys = Object.keys(data)            
            const selectedKeys = keys.filter( k => k !== 'totalPriceInput')

            const selected = selectedKeys.map(sk => {
                const parts = sk.split('_')
                return {
                    id_types: parseInt(parts[1]),
                    type: types.filter(t => t.id == parseInt(parts[1]))[0].type,
                    id_categories: parseInt(parts[2]),
                    category: categories.filter(c => c.id == parseInt(parts[2]))[0].category
                }
            })

            req.session.selection = selected
            req.session.price = parseFloat(data.totalPriceInput)

            // redirect
            return res.redirect('/professional-licences/classes')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // classes
    classes: async(req,res) => {
        try{

            let {flatOptions,selection} = await getSchedule(req.session)

            // filter monday of current week
            flatOptions = flatOptions.filter( o => o.id != 1)

            // filter wednesdey if day >= 3            
            const date =  new Date()
            const day = date.getDay()
            if (day >= 3) {
                flatOptions = flatOptions.filter( o => o.id != 2)
            }

            // add inscriptions
            for (let i = 0; i < flatOptions.length; i++) {
                const filters={
                    week_number: flatOptions[i].week_number,
                    year: flatOptions[i].year,
                    commission_number: flatOptions[i].commission_number
                }
                const inscriptions = await studentsQueries.get({filters})

                flatOptions[i].inscriptions = inscriptions.length
                flatOptions[i].quota = 40 - inscriptions.length
                
            }

            // filter if there are no available spaces
            flatOptions = flatOptions.filter ( o => o.quota > 0)

            const price = req.session.price

            return res.render('professionalLicences/schedule',{title:'FEVB - Inscripciones',flatOptions, selection, price})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // setSchedule
    setSchedule: async(req,res) => {
        try{

            const data = req.body
            const {flatOptions,selection} = await getSchedule(req.session)
            const selectedOption = flatOptions.filter( o => o.id == data.selectDate)[0]
            req.session.schedule = selectedOption
            const feDescription = req.session.schedule.description
            const ciuDescription = req.session.schedule.ciu ? (' Y ' + req.session.schedule.ciu_description) : ''
            req.session.scheduleFullDescription = feDescription + ciuDescription
            
            // redirect
            return res.redirect('/professional-licences/personal-data')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // persona data
    personalData: async(req,res) => {
        try{

            const {flatOptions,selection} = await getSchedule(req.session)

            const price = req.session.price

            return res.render('professionalLicences/personalData',{title:'FEVB - Inscripciones',selection, price})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // setPersonalData
    setPersonalData: async(req,res) => {
        try{

            const data = req.body

            req.session.name = data.nameInfo
            req.session.cuit = data.cuit
            req.session.email = data.email
            req.session.phone_number = data.phone            
            
            // redirect
            return res.redirect('/professional-licences/checkout')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // checkout
    checkout: async(req,res) => {
        try{

            const {flatOptions,selection} = await getSchedule(req.session)

            const schedule = req.session.scheduleFullDescription
            const price = req.session.price
            const name = req.session.name
            const cuit = req.session.cuit
            const email = req.session.email
            const phoneNumber = req.session.phone_number            

            return res.render('professionalLicences/checkout',{title:'FEVB - Inscripciones',selection, price, schedule, name, cuit, email, phoneNumber})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // save inscription
    saveInscription: async(req,res) => {
        try{

            const data = req.session

            // get data for pl_students
            const studentsData = [{
                cuit: data.cuit,
                name: data.name,
                email: data.email,
                phone_number: parseInt(data.phone_number),
                week_number: data.schedule.week_number,
                year:data.schedule.year,
                price: data.price,
                commission_name:data.schedule.commission_name,
                commission_number:data.schedule.commission_number
            }]

            // save pl_students
            const createdData = await studentsQueries.create(studentsData)

            // get data for save pl_students_types_categories
            const selection = data.selection.map(item => ({
                ...item,
                id_students: createdData[0].id
            }))

            // save pl_students_types_categories
            await studentsTypesCategoriesQueries.create(selection)

            // get data for pl_students_attendance
            const attendance = []
            data.schedule.option.forEach(o => {
                if (o.shift_M == 1) {
                    attendance.push({
                        id_students:createdData[0].id,
                        week_number: o.week_number,
                        year: o.year,
                        date_string: o.date_string,
                        day_number: o.day_number,
                        shift: o.shift[0] + 'M',
                        attended: 0
                    })
                }
                if (o.shift_T == 1) {
                    attendance.push({
                        id_students:createdData[0].id,
                        week_number: o.week_number,
                        year: o.year,
                        date_string: o.date_string,
                        day_number: o.day_number,
                        shift: o.shift[0] + 'T',
                        attended: 0
                    })
                }
            })

            // add CIU data if applies
            if (data.schedule.ciu) {
                data.schedule.ciu_date.forEach(d => {
                    if (d.shift_M == 1) {
                        attendance.push({
                            id_students:createdData[0].id,
                            week_number: d.week_number,
                            year: d.year,
                            date_string: d.date_string,
                            day_number: d.day_number,
                            shift: d.shift[0] + 'M',
                            attended: 0
                        })
                    }
                    if (d.shift_T == 1) {
                        attendance.push({
                            id_students:createdData[0].id,
                            week_number: d.week_number,
                            year: d.year,
                            date_string: d.date_string,
                            day_number: d.day_number,
                            shift: d.shift[0] + 'T',
                            attended: 0
                        })
                    }
                })
            }

            // save pl_students_attendance
            await studentsAttendanceQueries.create(attendance)

            // send email
            const selectionData = await getSchedule(req.session)
            const mailData = {
                name: req.session.name,
                email: req.session.email,
                cuit: req.session.cuit,
                price: String(req.session.price.toLocaleString('es-AR',{minimumFractionDigits: 0,maximumFractionDigits: 0})),
                schedule: req.session.scheduleFullDescription,
                selection: selectionData.selection
            }

            const td = await transporterData()
            await sendMail(td,mailData)

            req.session.destroy()

            return res.render('professionalLicences/confirmation',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = professionalLicencesController

