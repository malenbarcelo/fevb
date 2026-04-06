const studentsQueries = require("../../dbQueries/students/studentsQueries.js")
const studentsExamsTheoricalsAnswersQueries = require("../../dbQueries/students/studentsExamsTheoricalsAnswersQueries.js")
const examsTheoricalsQuestionsQueries = require("../../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const getStudentsExams = require("../../utils/studentsExamsUtils.js")
const studentsExamsQueries = require("../../dbQueries/students/studentsExamsQueries.js")

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

            console.log(req.session)

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
            let studentData = await studentsQueries.get({filters:{cuit_cuil:cuitCuil, enabled:1}})
            studentData = studentData.rows
            const firstName = studentData[studentData.length - 1].first_name
            const lastName = studentData[studentData.length - 1].last_name

            // req.session.studentLogged
            req.session.studentLogged.studentData = {cuitCuil: cuitCuil, firstName: firstName, lastName: lastName, name: firstName + ' ' + lastName}

            return res.redirect('/examenes/pendientes')

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
            let pendingExams = await getStudentsExams({undefined,undefined,filters:{cuit_cuil:cuitCuil,enabled:1,theoricals_status:['pending','in-progress','not-passed']}})
            
            pendingExams = pendingExams.rows

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
            studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})

            // if not-passed exam, delete answers
            if (studentExam.rows[0].theorical_status == 'not-passed') {
                const data = [{
                    id_students_exams: studentExam.rows[0].id,
                    dataToUpdate: {
                        ids_selected_options: null,
                        date: null,
                    }
                }]

                await studentsExamsTheoricalsAnswersQueries.update('id_students_exams',data)
                studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})
            }

            req.session.studentLogged.studentExam = studentExam.rows[0]

            res.redirect('/examenes/preguntas')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    // retake exam
    retakeExam: async(req,res) => {
        try{

            // get student exam data
            const idStudentsExams = req.session.studentLogged.studentExam.id
            studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})

            // if not-passed exam, delete answers
            if (studentExam.rows[0].theorical_status == 'not-passed') {
                const data = [{
                    id_students_exams: studentExam.rows[0].id,
                    dataToUpdate: {
                        ids_selected_options: null,
                        date: null,
                    }
                }]

                await studentsExamsTheoricalsAnswersQueries.update('id_students_exams',data)
                studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})
            }

            req.session.studentLogged.studentExam = studentExam.rows[0]

            res.redirect('/examenes/preguntas')

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

            // get student exam data
            const studentExam = req.session.studentLogged.studentExam
            const idStudentsExams = studentExam.id
            const passGrade = Number(studentExam.exam_theorical_data.pass_grade)
            const idExamsTheoricals = studentExam.id_exams_theoricals
            const version = studentExam.exam_theorical_version
            const variant = studentExam.exam_theorical_variant

            // get result
            let answers = await studentsExamsTheoricalsAnswersQueries.get({undefined, undefined, filters:{id_students_exams:idStudentsExams}})
            answers = answers.rows
            const filters = {id_exams_theoricals: idExamsTheoricals, exam_theorical_versio: version, exam_theorical_variant: variant}
            const questions = await examsTheoricalsQuestionsQueries.get({filters})

            answers.forEach(answer => {
                const options = questions
                    .find( q => q.id == answer.id_exams_theoricals_questions).question_options
                    .filter( o => o.correct_option == 1)
                const correctOptions = options.map( o => o.id)
                const selectedOptions = answer.ids_selected_options.split(',').map( a => Number(a))

                // compare selected vs correct
                const same =
                    correctOptions.length === selectedOptions.length &&
                    [...correctOptions].sort().every((v, i) => v === [...selectedOptions].sort()[i])

                answer.correct_answer = same ? 1 : 0
            })

            // update exam data
            const correctAnswers = answers
                                    .filter( a => a.correct_answer == 1)
                                    .length
                                    const questionsQty = questions.length
            const answersToPass = Math.ceil(Number(passGrade) * questionsQty)
            req.session.studentLogged.action = 'viewTheoricalExam'
            const grade = correctAnswers / questionsQty
            const examStatus = grade >= passGrade ? 'passed' : 'not-passed'

            // update students exams
            const data = [{
                id: idStudentsExams,
                dataToUpdate:{
                    theorical_status: examStatus,
                    theorical_date: new Date(),
                    theorical_grade: grade
                }
            }]
            await studentsExamsQueries.update('id',data)

            // render result
            return res.render('exams/theoricals/theoricalResult',{title:'FEVB - Exámenes',examStatus, questionsQty,correctAnswers, grade, passGrade, answersToPass})

        }catch(error){ 
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // view exam answers
    viewExamAnswers: async(req,res) => {
        try{

            // update student exam data
            const studentExam = req.session.studentLogged.studentExam
            const idStudentsExams = studentExam.id
            const idExamsTheoricals = studentExam.id_exams_theoricals
            const version = studentExam.exam_theorical_version
            const variant = studentExam.exam_theorical_variant
            
            const examName = studentExam.exam_theorical_data.exam_name
            
            const answerDetails = await studentsExamsTheoricalsAnswersQueries.get({undefined, undefined, filters:{id_students_exams:idStudentsExams}})
            const filters = {id_exams_theoricals: idExamsTheoricals, exam_theorical_versio: version, exam_theorical_variant: variant}
            const examQuestions = await examsTheoricalsQuestionsQueries.get({filters})

            const questionData = examQuestions.map(q => ({
                id: q.id,
                question: q.question,
                question_number: q.question_number,
                question_options: q.question_options,
                image : q.image
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

