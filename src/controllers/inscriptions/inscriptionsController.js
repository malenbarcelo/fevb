const domain = require("../../data/domain")
const studentsQueries = require("../../dbQueries/courses/studentsQueries")

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
                {idCoursesTypes: 1,url: '/inscriptions/professional-licences/select-type'},
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
                const price = await (await fetch(`${domain}get/courses/prices?id_courses=[${coursesData[0].id}]&order=[["id","DESC"]]`)).json()
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

            const days = req.session.schedule.daysShifts

            const daysDescription = days
                .map(d => d.day + ' ' + d.shifts[0].date_string + ' ' + d.shifts[0].shift_description)
                .join(' Y ')

            const courseName = req.session.coursesData[0].course_name
            const price = req.session.price
            const name = req.session.name
            const cuit = req.session.cuit
            const email = req.session.email
            const phoneNumber = req.session.phone_number            

            return res.render('inscriptions/checkout',{title:'FEVB - Inscripciones',price, daysDescription, courseName, name, cuit, email, phoneNumber})

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

            // // get data for save pl_students_types_categories
            // const selection = data.selection.map(item => ({
            //     ...item,
            //     id_students: createdData[0].id
            // }))

            // // save pl_students_types_categories
            // await studentsTypesCategoriesQueries.create(selection)

            // // get data for pl_students_attendance
            // const attendance = []
            // data.schedule.option.forEach(o => {
            //     if (o.shift_M == 1) {
            //         attendance.push({
            //             id_students:createdData[0].id,
            //             week_number: o.week_number,
            //             year: o.year,
            //             date_string: o.date_string,
            //             day_number: o.day_number,
            //             shift: o.shift[0] + 'M',
            //             attended: 0
            //         })
            //     }
            //     if (o.shift_T == 1) {
            //         attendance.push({
            //             id_students:createdData[0].id,
            //             week_number: o.week_number,
            //             year: o.year,
            //             date_string: o.date_string,
            //             day_number: o.day_number,
            //             shift: o.shift[0] + 'T',
            //             attended: 0
            //         })
            //     }
            // })

            // // add CIU data if applies
            // if (data.schedule.ciu) {
            //     data.schedule.ciu_date.forEach(d => {
            //         if (d.shift_M == 1) {
            //             attendance.push({
            //                 id_students:createdData[0].id,
            //                 week_number: d.week_number,
            //                 year: d.year,
            //                 date_string: d.date_string,
            //                 day_number: d.day_number,
            //                 shift: d.shift[0] + 'M',
            //                 attended: 0
            //             })
            //         }
            //         if (d.shift_T == 1) {
            //             attendance.push({
            //                 id_students:createdData[0].id,
            //                 week_number: d.week_number,
            //                 year: d.year,
            //                 date_string: d.date_string,
            //                 day_number: d.day_number,
            //                 shift: d.shift[0] + 'T',
            //                 attended: 0
            //             })
            //         }
            //     })
            // }

            // // save pl_students_attendance
            // await studentsAttendanceQueries.create(attendance)

            // // send email
            // const selectionData = await getSchedule(req.session)
            // const mailData = {
            //     name: req.session.name,
            //     email: req.session.email,
            //     cuit: req.session.cuit,
            //     price: String(req.session.price.toLocaleString('es-AR',{minimumFractionDigits: 0,maximumFractionDigits: 0})),
            //     schedule: req.session.scheduleFullDescription,
            //     selection: selectionData.selection
            // }

            // const td = await transporterData()
            // await sendMail(td,mailData)

            // // post data to google sheets
            // const dataToPost = getDataToPost(createdData[0], data)
            // await postData(dataToPost)

            // req.session.destroy()

            // return res.render('professionalLicences/confirmation',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = inscriptionsController

