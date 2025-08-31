const domain = require("../../data/domain")
const studentsQueries = require("../../dbQueries/courses/studentsQueries")
const studentsAttendanceQueries = require("../../dbQueries/courses/studentsAttendanceQueries")
const {transporterData, sendMail} = require("../../functions/mailFunctions")
const {postData,getDataToPost} = require("../../functions/postGSdata")

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
                {idCoursesTypes: 1,url: '/professional-licences/inscriptions'},
                {idCoursesTypes: 2,url: '/inscriptions/select-course'},
                {idCoursesTypes: 3,url: '/inscriptions/select-course'},                
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

    setCourse: async(req,res) => {
        try{

            const data = req.body
            const alias = data.courseButton

            // define redirectio according to course type
            let redirection = ''            
            if (alias == 'cargas_peligrosas_obtencion') {
                redirection = '/inscriptions/hazardous-materials/sworn-declaration'
            }else{
                redirection = '/inscriptions/schedule'
                const courseData = await (await fetch(`${domain}get/courses?alias=${alias}`)).json()
                const price = await (await fetch(`${domain}get/courses/prices?id_courses=[${courseData[0].id}]&order=[["id","DESC"]]`)).json()
                req.session.coursesData = courseData
                req.session.price = parseFloat(price[0].price)
            }

            // redirect
            return res.redirect(redirection)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    schedule: async(req,res) => {
        try{

            // get data
            const price = req.session.price
            const title = req.session.coursesData[0].course_name

            const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options?id_courses=${req.session.coursesData[0].id}`)).json()
            
            return res.render('inscriptions/schedule',{title:'FEVB - Inscriptiones',scheduleOptions,title,price})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setSchedule: async(req,res) => {
        try{

            const data = req.body

            const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options?id_courses=${req.session.coursesData[0].id}`)).json()

            const selectedOption = scheduleOptions.find( s => s.id == data.selectDate)

            req.session.schedule = selectedOption
            req.session.scheduleDescription = selectedOption.daysShifts
                                                .map(d => d.day + ' ' + d.shifts[0].date_string + ' ' + d.shifts[0].shift_description)
                                                .join(' Y ')
            // redirect
            return res.redirect('/inscriptions/personal-data')

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
            
            return res.render('inscriptions/personalData',{title:'FEVB - Inscripciones',title,price})
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
            return res.redirect('/inscriptions/checkout')

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

            return res.render('inscriptions/checkout',{title:'FEVB - Inscripciones',price, scheduleDescription, courseName, name, cuit, email, phoneNumber})

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

            // send email
            const mailData = {
                name: data.name,
                email: data.email,
                cuit: data.cuit,
                price: String(data.price.toLocaleString('es-AR',{minimumFractionDigits: 0,maximumFractionDigits: 0})),
                scheduleDescription: data.scheduleDescription,
                selection: data.coursesData
            }

            const td = await transporterData()
            await sendMail(td,mailData)

            // post data to google sheets
            const dataToPost = getDataToPost(createdData[0], data)
            await postData(dataToPost)

            req.session.destroy()

            return res.render('inscriptions/confirmation',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = inscriptionsController

