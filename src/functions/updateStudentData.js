const df = require("../functions/datesFuntions")
const studentsQueries = require("../dbQueries/students/studentsQueries.js")
const studentsTheoricalsAnswersQueries = require("../dbQueries/students/studentsTheoricalsAnswersQueries.js")
const studentsAnswersDetailsQueries = require("../dbQueries/students/studentsAnswersDetailsQueries.js")
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")

const updateStudentData = {

    weeksToShow: (weeks) => {

        const weeksToShow = df.getNweeks(weeks)
        const date = new Date()
        const dateArg = date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
        const year = dateArg.split(',')[0].split('/')[2]
        const week = df.getWeekNumber(date)
        const yearWeek = year + '_' + week.weekNumber
        const yearWeekPosition = weeksToShow.indexOf(yearWeek)

        return { weeksToShow, yearWeekPosition }

    },

    studentData: async(cuit,req) => {

        const { weeksToShow } = updateStudentData.weeksToShow(8)
        
        let studentData = await studentsQueries.get({filters:{cuit:cuit, year_week:weeksToShow}})
        studentData = studentData.rows.map(d => d.get({ plain: true }))

        return studentData

    },

    pendingExams: (studentData, req) => {

        const { weeksToShow, yearWeekPosition } = updateStudentData.weeksToShow(8)

        // get exams
        const pendingExams = studentData
            .flatMap(sd => {
                const attended = sd.attendance.some(a => a.attended == 0) ? false : true
                const payments = sd.payments.reduce((sum, item) => sum + parseFloat(item.amount), 0)
                const paid = payments >= parseFloat(sd.price)
                const pending_course = yearWeekPosition < weeksToShow.indexOf(sd.year_week)
                //const course_status = pending ? 'Curso pendiente' : ( !paid ? 'Pago pendiente' : ( !attended ? 'Curso incompleto' : 'Examen autorizado' ))
                return sd.student_exams.map(exam => ({ ...exam, attended, paid, pending_course }))
            })
            .sort((a, b) => 
                a.exam_data.exam_name.localeCompare(b.exam_data.exam_name)
            )

        // exam status
        pendingExams.forEach(exam => {
            exam.status =
                exam.pending_course            ? 'Curso pendiente'
                : !exam.paid                     ? 'Pago pendiente'
                : !exam.attended                 ? 'Curso incompleto'
                : !exam.id_students_answers      ? 'Examen pendiente'
                : exam.student_answer_data.status === 'in-progress'  ? 'Examen en proceso'
                : exam.student_answer_data.status === 'passed'       ? 'Aprobado'
                : exam.student_answer_data.status === 'not-passed'   ? 'Desaprobado'
                : exam.status
        })

        // CSS
        const statusMap = {
            'Aprobado': 'passed-exam',
            'Desaprobado': 'not-passed-exam',
            'Examen pendiente': 'pending-exam-status',
            'Examen en proceso': 'pending-exam-status'
        }

        const statusBtn = {
            'Aprobado': {text:'Hacer examen',class:'btn-std', type: 'submit'},
            'Desaprobado': {text:'Rehacer examen',class:'btn-std', type: 'submit'},
            'Examen en proceso': {text:'Continuar examen',class:'btn-std', type: 'submit'},
            'Examen pendiente': {text:'Hacer examen',class:'btn-std', type: 'submit'},
            'Curso pendiente': {text:'Hacer examen',class:'btn-unabled', type: 'button'},
            'Curso incompleto': {text:'Hacer examen',class:'btn-unabled', type: 'button'},
            'Pago pendiente': {text:'Hacer examen',class:'btn-unabled', type: 'button'},

        }

        pendingExams.forEach(exam => {

            exam.status_css = statusMap[exam.status] 
                || (exam.course_status != 'Examen autorizado' ? 'pending-course' : undefined)

            exam.button_data = statusBtn[exam.status]
        })

        return pendingExams

    },

    updateSessionData: async(req) => {

        const idStudentsExams = req.session.studentLogged.id_students_exams
        const studentsExamsData = await studentsExamsQueries.get({filters:{id:idStudentsExams}})
        const idExams = studentsExamsData[0].id_exams
        const idStudents = studentsExamsData[0].id_students        
        let answers = await studentsAnswersQueries.get({filters:{id_students_exams:idStudentsExams,order:[["id","DESC"]]}})
        let lastAnswer
        let lastAnswerDetails
        
        // if no answers, create answer
        if (answers.length == 0 || answers[0].status == 'not-passed') {
            
            // get version
            let version = await examsTheoricalsQuestionsQueries.getVersion(idExams)
            version = version.version

            // get variant
            let variants = await examsTheoricalsQuestionsQueries.uniqueVariants({filters:{id_exams:idExams,exam_version:version}})
            variants = variants.map( v => v.variants)
            const variant = answers.length > 0 ? answers[0].exam_variant : variants[Math.floor(Math.random() * variants.length)]
            
            // get date
            const date = new Date()
            let dateArg = date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
            dateArg = dateArg.split(',')[0].split('/')
            const day = String(dateArg[0].padStart(2,'0'))
            const month = String(dateArg[1].padStart(2,'0'))
            const year = String(dateArg[2])
            dateArg = `${day}/${month}/${year}`

            // create students answers
            const answerData = [{
                id_students_exams: idStudentsExams,
                id_students: idStudents,
                id_exams: idExams,
                exam_version: version,
                exam_variant: variant,
                attempt_number: answers.length == 0 ? 1 : Number(answers[0].attempt_number) + 1,
                start_date: dateArg,
                status: 'in-progress'
            }]

            lastAnswer = await studentsAnswersQueries.create(answerData)
            lastAnswer = lastAnswer[0]

            // create students answers details
            const answersDetails = []
            const questions = await examsTheoricalsQuestionsQueries.get({filters:{id_exam:idExams, exam_version:version, exam_variant: variant}})

            questions.forEach(question => {

                const correctOptions = question.question_options
                    .filter(o => o.correct_option == 1)
                    .map(o => o.id)
                    .join(',')

                answersDetails.push({
                    id_students_exams: idStudentsExams,
                    id_students_answers: lastAnswer.id,
                    id_students: idStudents,
                    id_exams: idExams,
                    id_exams_questions: question.id,
                    ids_correct_options: correctOptions
                })
            })

            lastAnswerDetails = await studentsAnswersDetailsQueries.create(answersDetails)
            
        }else{
            lastAnswer = answers[0]
            lastAnswerDetails = lastAnswer.answers
        }

        req.session.studentLogged.examData = studentsExamsData[0].exam_data
        req.session.studentLogged.lastAnswer = lastAnswer
        req.session.studentLogged.lastAnswerDetails = lastAnswerDetails

    },

}

module.exports = updateStudentData