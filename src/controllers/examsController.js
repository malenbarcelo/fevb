const examsQuestionsQueries = require("../dbQueries/exams/examsQuestionsQueries.js")
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const studentsAnswersQueries = require("../dbQueries/students/studentsAnswersQueries.js")
const studentsAnswersDetailsQueries = require("../dbQueries/students/studentsAnswersDetailsQueries.js")
const composedExamsController = require("./apisControllers/composedExamsController.js")
const usd = require("../functions/updateStudentData.js")
const gf = require("../functions/generalFunctions")
const { ids } = require("googleapis/build/src/apis/ids/index.js")

const examsController = {
    // enter student
    ingresar: (req,res) => {
        try{
            
            req.session.destroy()
            return res.redirect('/examenes/login')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // logout
    logout: (req,res) => {
        try{
            req.session.destroy()
            return res.redirect('/examenes/login')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // login
    login: (req,res) => {
        try{
            req.session.studentLogged = {}
            return res.render('exams/login',{title:'FEVB - Exámenes'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // set student data
    setStudentData: async(req,res) => {
        try{

            const cuit = Number(req.body.cuit)

            // student data
            const studentData = await usd.studentData(cuit,req)

            // req.session.studentLogged
            req.session.studentLogged.studentData = {cuit, name: studentData[0].name}

            return res.redirect('/examenes/pendientes')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // pending exams
    pendingExams: async(req,res) => {
        try{


            console.log(req.session.studentLogged)
            const cuit = req.session.studentLogged.studentData.cuit
            const studentData = await usd.studentData(cuit,req)
            const pendingExams = usd.pendingExams(studentData, req)

            return res.render('exams/pendingExams',{title:'FEVB - Exámenes', pendingExams})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // set exam
    setExam: async(req,res) => {
        try{

            const keys = Object.keys(req.body)
            const idStudentsExams = Number(keys[0])
            const studentsExamsData = await studentsExamsQueries.get({filters:{id_students_exams:ids}})
            
            req.session.studentLogged.id_students_exams = idStudentsExams

            await usd.updateSessionData(req)
            
            res.redirect('/examenes/preguntas')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // exam
    exam: async(req,res) => {
        try{

            const examName = req.session.studentLogged.examData.exam_name

            return res.render('exams/exam',{title:'FEVB - Exámenes',examName})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // exam result
    examResult: async(req,res) => {
        try{

            //const data = req.session.studentLogged
            // id
            // pass grade
            const passGrade = 0.75
            
            const studentAnswers = await studentsAnswersQueries.get({filters:{id_students_exams:2, order:[["id","DESC"]]}})
            const answersDetails = studentAnswers[0].answers
            const questionsQty = answersDetails.length
            const correctAnswers =  answersDetails.filter( d => d.correct_answer == 1).length
            const grade = correctAnswers / questionsQty
            const examStatus = grade >= passGrade ? 'passed' : 'not-passed'
            const answersToPass = Math.ceil(passGrade * questionsQty)

            // update exam status
            const date = new Date()
            const argDate = date.toLocaleString('es-AR', {timeZone: 'America/Argentina/Buenos_Aires'})
            const day = argDate.split(',')[0].split('/')[0]
            const month = argDate.split(',')[0].split('/')[1]
            const year = argDate.split(',')[0].split('/')[2]
            const dateString = day.padStart('0',2) + '/' + month.padStart('0',2) + '/' + year
            const dataToUpdate = [{id:studentAnswers[0].id,dataToUpdate:{status:examStatus,end_date:dateString,grade:grade}}]
            
            await studentsAnswersQueries.update('id',dataToUpdate)

            return res.render('exams/examResult',{title:'FEVB - Exámenes',examStatus, questionsQty, correctAnswers, answersToPass})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // exam answers
    examAnswers: async(req,res) => {
        try{

            // id last answer
            // exam name
            // exam questions
            // exam images



            const idLastAnswer = 130
            const examName = 'Licencias profesionales C'
            const idExams = 1
            const version = 1
            const variant = 'B'

            //const idLastAnswer = req.session.studentLogged.idLastAnswer.id
            //const idLastAnswer = req.session.studentLogged.examData
            const answerDetails = await studentsAnswersDetailsQueries.get({filters:{id_students_amswers:idLastAnswer}})
            const examQuestions = await examsQuestionsQueries.get({filters:{id_exams:idExams,exam_version:version,exam_variant:variant}})
            //const examImages = await gf.getExamImages(req)
            //console.log(examImages)

            const questionData = examQuestions.map(q => ({
                id: q.id,
                question: q.question,
                question_number: q.question_number,
                question_options: q.question_options,
                //question_images : examImages.examFiles.filter( f => f.split('_')[3] == 'question' + q.question_number)
                question_images: ['LP/exam1_version1_variantB_question1_optionA.jpg','LP/exam1_version1_variantB_question1_optionB.jpg','LP/exam1_version1_variantB_question1_optionC.jpg']
            }))

            questionData.forEach(qd => {
                const idQuestions = qd.id
                const answer = answerDetails.find( a => a.id_exams_questions == idQuestions)
                const selectedOptions = answer.ids_selected_options.split(',').map( a => Number(a))
                const correctAnswer = answer.correct_answer
                qd.question_options.forEach(o => {
                    o.selected = selectedOptions.includes(o.id)
                    o.correct_answer = correctAnswer
                    o.boxCss = o.selected ? (correctAnswer == 1 ? 'box-ok' : 'box-error') : ''
                    o.checkCss = o.selected ? (correctAnswer == 1 ? '' : 'not-visible') : 'not-visible'
                    o.errorCss = o.selected ? (correctAnswer == 1 ? 'not-visible' : '') : 'not-visible'
                })                
            })

            console.log(questionData)

            return res.render('exams/examAnswers',{title:'FEVB - Exámenes',examName, questionData})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    
}
module.exports = examsController

