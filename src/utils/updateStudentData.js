const df = require("./datesFuntions.js")
const studentsQueries = require("../dbQueries/students/studentsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")

const updateStudentData = {

    // weeksToShow: (weeks) => {

    //     const weeksToShow = df.getNweeks(weeks)
    //     const date = new Date()
    //     const dateArg = date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    //     const year = dateArg.split(',')[0].split('/')[2]
    //     const week = df.getWeekNumber(date)
    //     const yearWeek = year + '_' + week.weekNumber
    //     const yearWeekPosition = weeksToShow.indexOf(yearWeek)

    //     return { weeksToShow, yearWeekPosition }

    // },

    // studentData: async(cuit,req) => {

    //     const { weeksToShow } = updateStudentData.weeksToShow(8)
        
    //     let studentData = await studentsQueries.get({filters:{cuit:cuit, year_week:weeksToShow}})
    //     studentData = studentData.rows

    //     return studentData

    // },

    // updateSessionData: async(req) => {
    
    //     const data = req.session.studentLogged.studentExam
    //     const answers = data.theoricals_answers
    //     const idExams = data.id_exams_theoricals
    //     const idStudents = data.id_students
    //     const idStudentsExams = data.id

    //     let lastAnswer
    //     let lastAnswerDetails
        
        
    //     // if no answers, or not-passed, create answer
    //     if (answers.length == 0 || answers[0].status == 'not-passed') {
            
    //         // gert version
    //         const version = answers.length == 0 ? data.lastTheoricalVersion : answers[0].exam_theorical_version

    //         // get variant
    //         let variants = await examsTheoricalsQuestionsQueries.uniqueVariants({filters:{id_exams_theoricals:idExams,exam_theorical_version:version}})
    //         variants = variants.map( v => v.variants)
    //         const variant = answers.length > 0 ? answers[0].exam_theorical_variant : variants[Math.floor(Math.random() * variants.length)]
            
    //         // get date
    //         const date = new Date()
    //         let dateArg = date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    //         dateArg = dateArg.split(',')[0].split('/')
    //         const day = String(dateArg[0].padStart(2,'0'))
    //         const month = String(dateArg[1].padStart(2,'0'))
    //         const year = String(dateArg[2])
    //         dateArg = `${day}/${month}/${year}`

    //         // create students answers
    //         const answerData = [{
    //             id_students_exams: idStudentsExams,
    //             id_students: idStudents,
    //             id_exams_theoricals: idExams,
    //             exam_theorical_version: version,
    //             exam_theorical_variant: variant,
    //             attempt_number: answers.length == 0 ? 1 : Number(answers[0].attempt_number) + 1,
    //             start_date: dateArg,
    //             status: 'in-progress'
    //         }]

    //         lastAnswer = await studentsTheoricalsAnswersQueries.create(answerData)
    //         lastAnswer = lastAnswer[0]

    //         // create students answers details
    //         const answersDetails = []
    //         const questions = await examsTheoricalsQuestionsQueries.get({filters:{id_exams_theoricals:idExams, exam_theorical_version:version, exam_theorical_variant: variant}})

    //         questions.forEach(question => {

    //             const correctOptions = question.question_options
    //                 .filter(o => o.correct_option == 1)
    //                 .map(o => o.id)
    //                 .join(',')

    //             answersDetails.push({
    //                 id_students_exams: idStudentsExams,
    //                 id_students_theoricals_answers: lastAnswer.id,
    //                 id_students: idStudents,
    //                 id_exams_theoricals: idExams,
    //                 id_exams_theoricals_questions: question.id,
    //                 ids_correct_options: correctOptions
    //             })
    //         })

    //         lastAnswerDetails = await studentsTheoricalsAnswersDetailsQueries.create(answersDetails)
    //     }else{
    //         lastAnswer = answers[0]
    //         lastAnswerDetails = lastAnswer.theoricals_answers_details
    //     }

    //     // update students exams
    //     const dataToUpdate = [{id:idStudentsExams,dataToUpdate:{theoricals_status:'in-progress'}}]
    //     await studentsExamsQueries.update('id',dataToUpdate)

    //     req.session.studentLogged.lastAnswer = lastAnswer
    //     req.session.studentLogged.lastAnswerDetails = lastAnswerDetails

    // },

}

module.exports = updateStudentData