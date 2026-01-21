const studentsTheoricalsAnswersQueries = require("../../dbQueries/students/studentsTheoricalsAnswersQueries.js")
const studentsTheoricalsAnswersDetailsQueries = require("../../dbQueries/students/studentsTheoricalsAnswersDetailsQueries.js")
const studentsExamsQueries = require("../../dbQueries/students/studentsExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const usd = require("../../utils/updateStudentData.js")
const getStudentsExams = require("../../utils/studentsExamsUtils.js")
const gf = require("../../utils/generalFunctions.js")

const examsController = {
    // enter student
    ingresar: (req,res) => {
        try{
            req.session.destroy()
            return res.redirect('/cuestionarios/login')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // logout
    logout: (req,res) => {
        try{
            req.session.destroy()
            return res.redirect('/cuestionarios/login')
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // login
    login: (req,res) => {
        try{
            req.session.studentLogged = {}
            return res.render('exams/theoricals/login',{title:'FEVB - Exámenes'})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // set student data
    setStudentData: async(req,res) => {
        try{

            const cuitCuil = Number(req.body.cuitCuil)

            // student data
            const studentData = await usd.studentData(cuitCuil,req)

            // req.session.studentLogged
            req.session.studentLogged.studentData = {cuitCuil: cuitCuil, first_name: studentData[0].first_name, last_name: studentData[0].last_name, name: studentData[0].first_name + ' ' + studentData[0].last_name}

            return res.redirect('/cuestionarios/pendientes')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // pending exams
    pendingExams: async(req,res) => {
        try{

            const cuitCuil = req.session.studentLogged.studentData.cuitCuil

            // pending exams
            let pendingExams = await getStudentsExams({undefined,undefined,filters:{cuit_cuil:cuitCuil, theoricals_status:['pending','in-progress','not-passed']}})
            
            pendingExams = pendingExams.rows
            
            pendingExams.sort((a, b) => a.id - b.id)

            console.log(pendingExams)
            
            return res.render('exams/theoricals/pendingTheoricals',{title:'FEVB - Exámenes', pendingExams})

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
            
            // get student exam data
            const studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})

            req.session.studentLogged.studentExam = studentExam.rows[0]

            // add last answers to session
            await usd.updateSessionData(req)
            
            res.redirect('/cuestionarios/preguntas')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // retake exam
    retakeExam: async(req,res) => {
        try{

            const idStudentsExams = req.session.studentLogged.studentExam.id
            
            // get student exam data
            const studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})

            req.session.studentLogged.studentExam = studentExam.rows[0]

            // add last answers to session
            await usd.updateSessionData(req)
            
            res.redirect('/cuestionarios/preguntas')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // exam
    exam: async(req,res) => {
        try{

            // const studentLogged = (domain == 'http://localhost:3012/' && !req.session.studentLogged) ? studentLoggedDev : req.session.studentLogged ///////////////////////////////////////

            const examName = req.session.studentLogged.studentExam.exam_theorical_data.exam_name

            return res.render('exams/theoricals/theorical',{title:'FEVB - Exámenes',examName})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // exam result
    examResult: async(req,res) => {
        try{

            const data = req.session.studentLogged.studentExam
            const passGrade = Number(data.exam_theorical_data.pass_grade)
            const idStudentsExams = data.id
            const answers = await studentsTheoricalsAnswersQueries.get({filters:{id_students_exams:idStudentsExams, order:[["id","DESC"]]}})
            const answersDetails = answers[0].theoricals_answers_details
            const questionsQty = answersDetails.length
            const correctAnswers =  answersDetails.filter( d => d.correct_answer == 1).length
            const grade = correctAnswers / questionsQty
            const examStatus = grade >= passGrade ? 'passed' : 'not-passed'
            const answersToPass = Math.ceil(passGrade * questionsQty)

            // get date
            const date = new Date()
            const argDate = date.toLocaleString('es-AR', {timeZone: 'America/Argentina/Buenos_Aires'})
            const day = String(argDate.split(',')[0].split('/')[0])
            const month = String(argDate.split(',')[0].split('/')[1])
            const year = String(argDate.split(',')[0].split('/')[2])
            const dateString = day.padStart(2,'0') + '/' + month.padStart(2,'0') + '/' + year
            
            // update students theoricals answers
            const dataToUpdate1 = [{id:answers[0].id,dataToUpdate:{status:examStatus,end_date:dateString,grade:grade}}]
            await studentsTheoricalsAnswersQueries.update('id',dataToUpdate1)

            // update students exams
            const dataToUpdate2 = [{id:idStudentsExams,dataToUpdate:{theoricals_status:examStatus}}]
            await studentsExamsQueries.update('id',dataToUpdate2)

            return res.render('exams/theoricals/theoricalResult',{title:'FEVB - Exámenes',examStatus, questionsQty, correctAnswers, answersToPass})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // exam answers
    examAnswers: async(req,res) => {
        try{

            const idLastAnswer = req.session.studentLogged.lastAnswer.id
            const examName = req.session.studentLogged.studentExam.exam_theorical_data.exam_name
            const courseType = req.session.studentLogged.studentExam.exam_theorical_data.courses_types_alias
            const idExams = req.session.studentLogged.studentExam.exam_theorical_data.id
            const version = req.session.studentLogged.lastAnswer.exam_theorical_version
            const variant = req.session.studentLogged.lastAnswer.exam_theorical_variant

            const answerDetails = await studentsTheoricalsAnswersDetailsQueries.get({filters:{id_students_theoricals_answers:idLastAnswer}})
            const examQuestions = await examsTheoricalsQuestionsQueries.get({filters:{id_exams:idExams,exam_theorical_version:version,exam_theorical_variant:variant}})
            const examImages = await gf.getExamImages(req)

            const questionData = examQuestions.map(q => ({
                id: q.id,
                course_type: courseType,
                question: q.question,
                question_number: q.question_number,
                question_options: q.question_options,
                question_image : examImages.examFiles.filter( f => f.split('_')[3].split('.')[0] == 'question' + q.question_number)
            }))

            questionData.forEach(qd => {
                const idQuestions = qd.id
                const answer = answerDetails.find( a => a.id_exams_theoricals_questions == idQuestions)
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
            return res.render('exams/theoricals/theoricalAnswers',{title:'FEVB - Exámenes',examName, questionData})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    
}
module.exports = examsController

