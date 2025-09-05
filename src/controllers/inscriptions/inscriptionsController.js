const domain = require("../../data/domain")
const studentsQueries = require("../../dbQueries/courses/studentsQueries")
const studentsAttendanceQueries = require("../../dbQueries/courses/studentsAttendanceQueries")
const {transporterData, sendMail} = require("../../functions/mailFunctions")
const {postData,getDataToPost} = require("../../functions/postGSdata")
const fetch = require('node-fetch')

const inscriptionsController = {
    mainMenu: async(req,res) => {
        try{

            const coursesTypes = await (await fetch(`${domain}get/courses/types?enabled=1&order=[["type","ASC"]]`)).json()

            return res.render('inscriptions/mainMenu',{title:'FEVB - Inscripciones',coursesTypes})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setCourseType: async(req,res) => {
        try{

            const urls = [
                //{idCoursesTypes: 1,url: '/professional-licences/inscriptions'},
                {idCoursesTypes: 1,url: '/inscripciones/licencias-profesionales'},
                {idCoursesTypes: 2,url: '/inscripciones/cursos'},
                {idCoursesTypes: 3,url: '/inscripciones/cursos'},                
            ]

            const data = req.body
            const courseType = await (await fetch(`${domain}get/courses/types?id=[${data.typeButton}]`)).json()

            const redirection = urls.find(url => url.idCoursesTypes == req.body.typeButton).url
            
            req.session.courseType = courseType[0]

            // redirect
            return res.redirect(redirection)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    selectCourse: async(req,res) => {
        try{
            
            // define course type
            const url = req.path
            const alias = url.includes('manejo-defensivo') ? ['MD'] : ['MP']
            const courseType =  await (await fetch(`${domain}get/courses/types?alias=${JSON.stringify(alias)}`)).json()
            req.session.courseType = courseType[0]
            req.session.types = [] // only if professional licences
            req.session.coursesData = []
            req.session.price = 0
            req.session.selectionSummary = []
            req.session.schedule = []
            req.session.scheduleDescription = ''
            req.session.name = ''
            req.session.cuit = ''
            req.session.email = ''
            req.session.phone_number = ''

            // get data
            const title = req.session.courseType.type
            const courses =  await (await fetch(`${domain}get/courses?id_courses_types=[${req.session.courseType.id}]`)).json()
            const coursesAlias = [...new Set(courses.map(c => c.alias))]
            const coursesToShow = []
            coursesAlias.forEach(alias => {
                coursesToShow.push({
                    alias:alias,
                    courseName:courses.find( c => c.alias == alias).course_name
                })
            })

            return res.render('inscriptions/selectCourse',{title:'FEVB - Inscriptiones',title,coursesToShow})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setCourses: async(req,res) => {
        try{

            const data = req.body
            const alias = data.courseButton
            const summary = [] // only if professional licences
            let redirection = ''

            if (alias) {
                // define redirectio according to course type
                if (alias == 'mercancias_peligrosas_obtencion') {
                    redirection = '/inscripciones/mercancias-peligrosas/declaracion-jurada'
                }else{
                    redirection = '/inscripciones/cronograma'
                    const courseData = await (await fetch(`${domain}get/courses?alias=${alias}`)).json()
                    const price = await (await fetch(`${domain}get/courses/prices?id_courses=[${courseData[0].id}]&order=[["id","DESC"]]`)).json()
                    req.session.coursesData = courseData
                    req.session.price = parseFloat(price[0].price)
                }   
            }else{
                redirection = '/inscripciones/cronograma'
                const keys = (Object.keys(data)).filter( key => key.split('_')[0] == 'check')
                const coursesIds = keys.map(key => parseInt(key.split('_')[1]))
                const coursesData = await (await fetch(`${domain}get/courses?id=${JSON.stringify(coursesIds)}`)).json()

                req.session.types.forEach(type => {
                    const courses = coursesData.filter( c => c.type_alias == type)
                    const categories = courses.map( item => item.category)
                    const typeName = courses[0].type
                    summary.push({
                        typeAlias: type,
                        categories: categories,
                        description: typeName + ': ' + categories.join(', ')
                    })                    
                })
                req.session.coursesData = coursesData
                req.session.price = parseFloat(data.totalPriceInput)
            }

            req.session.selectionSummary = summary

            // redirect
            return res.redirect(redirection)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    schedule: async(req,res) => {
        try{


            console.log(req.session)
            
            // get data
            const price = req.session.price
            const title = req.session.coursesData[0].course_name
            const idCourses = [...new Set(req.session.coursesData.map( cd => cd.id))]
            
            const selectionSummary = req.session.selectionSummary // only if professional licences

            const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options?id_courses=${JSON.stringify(idCourses)}`)).json()

            return res.render('inscriptions/schedule',{title:'FEVB - Inscriptiones',scheduleOptions,title,price, selectionSummary})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setSchedule: async(req,res) => {
        try{

            const data = req.body

            const idCourses = [...new Set(req.session.coursesData.map( cd => cd.id))]

            const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options?id_courses=${JSON.stringify(idCourses)}`)).json()

            const selectedOption = scheduleOptions.find( s => s.id == data.selectDate)

            req.session.schedule = selectedOption

            req.session.scheduleDescription = selectedOption.daysShifts
                                                .map(d => d.day + ' ' + d.shifts[0].date_string + ' ' + d.shiftDescription)
                                                .join(' Y ')
            // redirect
            return res.redirect('/inscripciones/datos-personales')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    personalData: async(req,res) => {
        try{

            // get data
            const price = req.session.price
            const title = req.session.coursesData[0].course_name
            const selectionSummary = req.session.selectionSummary // only if professional licences
            
            return res.render('inscriptions/personalData',{title:'FEVB - Inscripciones',title,price,selectionSummary})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setPersonalData: async(req,res) => {
        try{

            const data = req.body

            req.session.name = data.nameInfo
            req.session.cuit = data.cuit
            req.session.email = data.email
            req.session.phone_number = data.phone            
            
            // redirect
            return res.redirect('/inscripciones/confirmar-inscripcion')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    checkout: async(req,res) => {
        try{

            const courseName = req.session.coursesData[0].course_name
            const price = req.session.price
            const name = req.session.name
            const cuit = req.session.cuit
            const email = req.session.email
            const phoneNumber = req.session.phone_number
            const scheduleDescription = req.session.scheduleDescription
            const selectionSummary = req.session.selectionSummary // only if professional licences
            const selectionDescriptions = selectionSummary.map( s => s.description)
            const selectionText = selectionDescriptions.join(' || ')

            return res.render('inscriptions/checkout',{title:'FEVB - Inscripciones',price, scheduleDescription, courseName, name, cuit, email, phoneNumber,selectionText})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // save inscription
    saveInscription: async(req,res) => {
        try{

            const data = req.session
            
            // save data in students
            const studentsData = [{
                cuit: data.cuit,
                name: data.name,
                email: data.email,
                phone_number: parseInt(data.phone_number),
                year:data.schedule.year,
                week_number: data.schedule.week_number,
                year_week: data.schedule.year + '_' + data.schedule.week_number,
                id_courses_types: data.courseType.id,
                price: data.price,
            }]

            // save students
            const createdData = await studentsQueries.create(studentsData)

            // save data in students_attendance
            const shifts = data.schedule.shifts.map(item => ({
                id_students: createdData[0].id,
                year: item.year,
                week_number: item.week_number,
                year_week: item.year_week,
                date_string: item.date_string,
                day_number: item.day_number,
                shift_alias: item.shift_alias,
                attended: 0
            }))

            // save students attendance
            await studentsAttendanceQueries.create(shifts)

            // selection
            let htmlSelection = ''
            if (data.courseType.alias == 'LP') {
                data.selectionSummary.forEach(s => {
                    htmlSelection += '<br>' + s.description
                });
                
            }else{
                data.coursesData.forEach(c => {
                    htmlSelection += '<br>' + c.course_name            
                });
            }

            // send email
            const mailData = {
                name: data.name,
                email: data.email,
                cuit: data.cuit,
                price: String(data.price.toLocaleString('es-AR',{minimumFractionDigits: 0,maximumFractionDigits: 0})),
                scheduleDescription: data.scheduleDescription,
                selection: htmlSelection
            }

            const td = await transporterData()
            await sendMail(td,mailData)

            // post data to google sheets
            const dataToPost = getDataToPost(createdData[0], data)
            await postData(dataToPost)

            console.log(req.session)

            req.session.destroy()

            return res.render('inscriptions/confirmation',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = inscriptionsController

