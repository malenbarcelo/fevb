const domain = require("../../data/domain")
const studentsQueries = require("../../dbQueries/students/studentsQueries")
const pricesQueries = require("../../dbQueries/courses/pricesQueries")
const coursesQueries = require("../../dbQueries/courses/coursesQueries")
const typesQueries = require("../../dbQueries/courses/typesQueries")
const inscriptionsQueries = require("../../dbQueries/inscriptions/inscriptionsQueries")
const studentsAttendanceQueries = require("../../dbQueries/students/studentsAttendanceQueries")
const {transporterData, sendMail, createTemplate} = require("../../utils/mailFunctions")
const {postData, getDataToPost} = require("../../utils/postGSdata")
const fetch = require('node-fetch')
const {getDevSession} = require("../../utils/getDevSession")
const {createStudentsCoursesExamsAnswers} = require("../../utils/createStudentsCoursesExamsAnswers")

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
                {idCoursesTypes: 1, url: '/inscripciones/licencias-profesionales'},
                {idCoursesTypes: 2, url: '/inscripciones/cursos'},
                {idCoursesTypes: 3, url: '/inscripciones/cursos'},
                {idCoursesTypes: 4, url: '/inscripciones/cursos'},                
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

            let alias

            const path = req.path

            if (path.includes('mercancias-peligrosas')) {
                alias = ['MP']
            }else{
                if (path.includes('manejo-defensivo')) {
                    alias = ['MD']
                }else{
                    if (path.includes('licencias-profesionales')) {
                        alias = ['LP']
                    }else{
                        if (path.includes('seguridad-privada')) {
                            //return res.redirect('https://schemasim.com/seguridad-privada/')
                            alias = ['SP']
                        }else{
                            alias = [req.session.courseType.alias]
                        }                        
                    }
                }
            }

            const courseType = await typesQueries.get({filters:{alias:alias}})
            req.session.courseType = courseType[0]
            
            // complete session
            req.session.types = [] // only if professional licences
            req.session.coursesData = null
            req.session.price = null
            req.session.selectionSummary = null
            req.session.schedule = null
            req.session.scheduleDescription = null
            req.session.hasPractical = null
            req.session.companyData = null
            req.session.quantity = 1 //default
            req.session.personalData = null
            req.session.inscriptionType = 'particular   '

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
                // define redirection according to course type
                if (alias == 'mercancias_peligrosas_obtencion') {
                    redirection = '/inscripciones/mercancias-peligrosas/declaracion-jurada'
                }else{
                    redirection = '/inscripciones/cronograma'
                    const courseData = await coursesQueries.get({filters:{alias:alias}})
                    let price = await pricesQueries.get({filters:{id_courses:courseData[0].id, order:[["id","DESC"]]}})

                    // get quantity price
                    const qtys = price.map( p => p.quantity).sort((a, b) => b - a)
                    const sessionQty = req.session.quantity
                    const qty = qtys.find(n => sessionQty >= n)
                    price = price.find( p => p.quantity == qty)

                    req.session.coursesData = courseData
                    req.session.hasPractical = courseData[0].id_exams_practicals == null ? 0 : 1
                    req.session.price = parseFloat(price.price)
                    
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
                req.session.hasPractical = coursesData[0].id_exams_practicals == null ? 0 : 1
                req.session.price = parseFloat(data.totalPriceInput)
            }

            req.session.selectionSummary = summary

            // redirect
            return res.redirect(`${redirection}`)

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
            const idCourses = [...new Set(req.session.coursesData.map( cd => cd.id))]
            const allowsBulkInsc = req.session.coursesData[0].allows_bulk_inscriptions            
            const selectionSummary = req.session.selectionSummary // only if professional licences

            const scheduleOptions = await (await fetch(`${domain}composed/courses/get-schedule-options?id_courses=${JSON.stringify(idCourses)}`)).json()

            const hasPractical = req.session.hasPractical
            const courseMethodology = req.session.coursesData[0].course_methodology

            return res.render('inscriptions/schedule',{title:'FEVB - Inscriptiones',scheduleOptions,title,price, selectionSummary, hasPractical,courseMethodology,allowsBulkInsc})

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

            if (req.session.coursesData[0].course_methodology == 'sync') {

                req.session.scheduleDescription = selectedOption.daysShifts
                    .map(d => d.day + ' ' + d.shifts[0].date_string + ' ' + d.shiftDescription + ' (' + d.duration + ' horas)')
                    .join(' Y ')
            }else{
                req.session.scheduleDescription = selectedOption.daysShifts
                    .map(d => d.day + ' ' + d.shifts[0].date_string)
            }

            // get redirection
            let redirection = ''
            if (req.session.coursesData[0].allows_bulk_inscriptions == 1) {
                redirection = '/inscripciones/inscripcion-masiva/tipo-de-inscripcion'                
            }else{
                redirection = '/inscripciones/datos-personales'
            }
            
            // redirect
            return res.redirect(redirection)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    inscriptionType: async(req,res) => {
        try{

            return res.render('inscriptions/inscriptionType',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setInscriptionType: async(req,res) => {
        try{

            const data = req.body
            const keys = Object.keys(data)
            const idCourses = req.session.coursesData[0].id
            const price = await pricesQueries.get({filters:{id_courses:[idCourses]}})
            req.session.price = Number(price.find( p => p.quantity == 1).price)

            // particular
            if (keys.includes('check_P')) {
                req.session.inscriptionType = 'particular'
                res.redirect('/inscripciones/datos-personales')
            }

            // company
            if (keys.includes('check_C')) {
                req.session.inscriptionType = 'company'
                res.redirect('/inscripciones/empresas/empresa')
            }

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    companyData: async(req,res) => {
        try{

            // get session if DEV
            getDevSession(req,'sid')

            // get data
            const title = req.session.coursesData[0].course_name

            return res.render('inscriptions/companyData',{title:'FEVB - Inscripciones',title})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setCompanyData: async(req,res) => {
        try{

            const data = req.body

            req.session.companyData = {
                company: data.company,
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone_number: data.phone
            }

            return res.redirect('/inscripciones/empresas/datos-personales')

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
            req.session.inscriptionType = 'particular'

            return res.render('inscriptions/personalData',{title:'FEVB - Inscripciones',title,price,selectionSummary})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    personalDataCompanies: async(req,res) => {
        try{

            // get session if DEV
            getDevSession(req,'sid')

            // get data
            const price = req.session.price
            const title = req.session.coursesData[0].course_name
            const idCourses = req.session.coursesData[0].id
            const company = req.session.companyData.company
            const commissionArray = req.session.schedule.shifts[0].complete_date.split('/')
            const commission = commissionArray[2] + commissionArray[1] + commissionArray[0]

            // get price list            
            const priceList = await pricesQueries.get({filters:{id_courses: [idCourses], order:[["quantity","ASC"]]}})
            
            return res.render('inscriptions/personalDataCompanies',{title:'FEVB - Inscripciones',title,price, priceList, company, commission})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    setPersonalData: async(req,res) => {
        try{

            let data = req.body

            const students = data.students ? data.students : [data]

            req.session.personalData = students
            req.session.price = data.price ? data.price : req.session.price
            req.session.quantity = students.length

            console.log(req.session)

            if (data.students) {
                res.status(200).json({response:'ok'})
            }else{
                // redirect
                return res.redirect('/inscripciones/confirmar-inscripcion')
            }
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    checkout: async(req,res) => {
        try{

            // get session if DEV
            getDevSession(req,'sid')

            const inscriptionType = req.session.inscriptionType
            const courseName = req.session.coursesData[0].course_name
            const price = Number(req.session.price)
            const company = inscriptionType == 'company' ? req.session.companyData.company : null
            const name = inscriptionType == 'particular' ? (req.session.personalData[0].first_name + ' ' + req.session.personalData[0].last_name): (req.session.companyData.first_name + ' ' + req.session.companyData.last_name)
            const cuitCuil = inscriptionType == 'particular' ? req.session.personalData[0].cuit_cuil : null
            const email = inscriptionType == 'particular' ? req.session.personalData[0].email : (req.session.companyData.email)
            const phoneNumber = inscriptionType == 'particular' ? req.session.personalData[0].phone_number : (req.session.companyData.phone_number)
            const scheduleDescription = req.session.scheduleDescription
            const selectionSummary = req.session.selectionSummary // only if professional licences
            const selectionDescriptions = selectionSummary.map( s => s.description)
            const selectionText = selectionDescriptions.join(' || ')
            const alias = req.session.courseType.alias
            const quantity = req.session.quantity            

            return res.render('inscriptions/checkout',{title:'FEVB - Inscripciones',price, scheduleDescription, courseName, name, cuitCuil, email, phoneNumber,selectionText,alias, inscriptionType, company, quantity})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // save inscription
    saveInscription: async(req,res) => {
        try{

            // get session if DEV
            getDevSession(req,'sid')

            const data = req.session
            const dateArray = req.session.schedule.shifts[0].complete_date.split('/')
            const commissionName = Number(dateArray[2] + dateArray[1] + dateArray[0])
            const expirationDays = data.coursesData[0].expiration_time_days
            let expirationDate = null
            const inscriptionType = data.inscriptionType

            if (expirationDays != null) {
                const date = new Date()
                date.setDate(date.getDate() + expirationDays)
                expirationDate = date
            }

            // save data in inscriptions
            const inscriptionData = [{
                inscription_type: inscriptionType,
                first_name: inscriptionType == 'particular' ? data.personalData[0].first_name : data.companyData.first_name,
                last_name: inscriptionType == 'particular' ? data.personalData[0].last_name : data.companyData.last_name,
                email: inscriptionType == 'particular' ? data.personalData[0].email : data.companyData.email,
                phone_number: inscriptionType == 'particular' ? data.personalData[0].phone_number : data.companyData.phone_number,
                company: inscriptionType == 'company' ? data.companyData.company : null
            }]

            const createdInscription = await inscriptionsQueries.create(inscriptionData)

            // save data in students
            const studentsData = []
            data.personalData.forEach(pd => {
                studentsData.push({
                    cuit_cuil: pd.cuit_cuil,
                    first_name: pd.first_name,
                    last_name: pd.last_name,
                    email: pd.email,
                    phone_number: parseInt(pd.phone_number),
                    year: data.schedule == null ? null : data.schedule.year,
                    week_number: data.schedule == null ? null : data.schedule.week_number,
                    year_week: data.schedule == null ? null : (data.schedule.year + '_' + data.schedule.week_number),
                    id_courses_types: data.courseType.id,
                    price: Number(data.price) / Number(data.quantity),
                    commission_name: commissionName,
                    company: inscriptionType == 'company' ? data.companyData.company : null,
                    expiration_date: expirationDate,
                    courses_methodology: data.coursesData[0].course_methodology,
                    id_inscriptions: createdInscription[0].id

                })
                
            })

            const createdStudents = await studentsQueries.create(studentsData)

            // get students courses
            const studentsCourses = []
            const idCourses = data.coursesData.map( cd => cd.id)
            
            createdStudents.forEach(cs => {

                idCourses.forEach(course => {
                    studentsCourses.push({
                        id_students: cs.id,
                        id_courses: course,
                        id_exams_theoricals: data.coursesData.find( c => c.id == course).id_exams_theoricals,
                        id_exams_practicals: data.coursesData.find( c => c.id == course).id_exams_practicals,
                    })
                })
            })

            // create students_exams and studenst_courses_exams
            await createStudentsCoursesExamsAnswers(studentsCourses)

            // save data in students_attendance
            let shifts = []

            createdStudents.forEach(cd => {

                shiftsData = data.schedule.shifts.map(item => ({
                    id_students: cd.id,
                    year: item.year,
                    week_number: item.week_number,
                    year_week: item.year_week,
                    date_string: item.date_string,
                    day_number: item.day_number,
                    shift_alias: item.shift_alias,
                    attended: 0
                }))

                shiftsData.forEach(s => {
                    shifts.push(s)
                })

            })

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
                name: inscriptionType == 'company' ? data.companyData.first_name + ' ' + data.companyData.last_name : data.personalData[0].first_name + ' ' + data.personalData[0].last_name,
                email: inscriptionType == 'company' ? data.companyData.email : data.personalData[0].email,
                cuitCuil: inscriptionType == 'company' ? null : data.personalData[0].cuit_cuil,
                company: inscriptionType == 'company' ? data.companyData.company : null,
                price: String(data.price.toLocaleString('es-AR',{minimumFractionDigits: 0,maximumFractionDigits: 0})),
                scheduleDescription: data.scheduleDescription,
                selection: htmlSelection,
                courseAlias: data.courseType.alias,
                inscriptionType: inscriptionType,
                quantity: data.quantity,
                courseMethodology: data.coursesData[0].course_methodology,
                commission: commissionName,
                inscriptionNumber: String(createdInscription[0].id).padStart(6,'0')
            }

            const html = createTemplate(mailData)

            const td = await transporterData()
            await sendMail(td,mailData,html)

            if (data.courseType.alias != "SP") {
                // post data to google sheets
                const dataToPost = await getDataToPost(createdStudents[0], data)
                await postData(dataToPost)
            }

            req.session.destroy()
            return res.render('inscriptions/confirmation',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // not available course
    notAvailableCourse: async(req,res) => {
        try{

                

            return res.render('inscriptions/notAvaliableCourse',{title:'FEVB - Inscripciones'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = inscriptionsController

