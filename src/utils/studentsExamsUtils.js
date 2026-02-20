
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const examsPracticalsQuestionsQueries = require("../dbQueries/exams/examsPracticalsQuestionsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")

async function getStudentsExams({limit,offset,filters}) {
    
    // get students exams
    const data = await studentsExamsQueries.get({limit,offset,filters})

    // get exams questions
    const idsExamsTheoricals = data.rows.map( r => r.id_exams_theoricals)
    const theoricalQuestions = await examsTheoricalsQuestionsQueries.get({filters:{id_exams_theoricals:idsExamsTheoricals}})

    // add theorical questions and pass grade
    for (const row of data.rows) {
        const examTheoricalsQuestions = theoricalQuestions.filter( q => q.id_exams_theoricals == row.id_exams_theoricals && q.exam_theorical_version == row.exam_theorical_version && q.exam_theorical_variant == row.exam_theorical_variant)
        row.exam_theorical_questions = examTheoricalsQuestions
        row.pass_grade = row.exam_theorical_data.pass_grade
    }

    // add theorical status
    for (const row of data.rows) {
        const theoricalAnswersQty = row.theoricals_answers.length
        const nullAnswers = row.theoricals_answers.filter( a => a.ids_selected_options == null).length

        if (theoricalAnswersQty == nullAnswers) {
            row.theorical_status = 'pending'        
        }else{
            if (nullAnswers > 0) {
                row.theorical_status = 'in-progress'
            }else{ // all questions answered
                let correctAnswers = 0
                row.theoricals_answers.forEach(answer => {
                    const options = row.exam_theorical_questions
                        .find( q => q.id == answer.id_exams_theoricals_questions).question_options
                        .filter( o => o.correct_option == 1)
                    const correctOptions = options.map( o => o.id)
                    const selectedOptions = answer.ids_selected_options.split(',').map( a => Number(a))

                    // compare selected vs correct
                    const same =
                        correctOptions.length === selectedOptions.length &&
                        [...correctOptions].sort().every((v, i) => v === [...selectedOptions].sort()[i])

                    correctAnswers = correctAnswers + (same ? 1 : 0)

                    answer.correct_answer = same ? 1 : 0

                    
                })

                const answersToPass = Math.ceil(Number(row.pass_grade) * theoricalAnswersQty)

                const grade = correctAnswers / theoricalAnswersQty
                row.grade = grade
                row.theorical_questions = theoricalAnswersQty
                row.correct_answers = correctAnswers
                row.theorical_status = grade >= row.pass_grade ? 'passed' : 'not-passed' 
                row.answers_to_pass = answersToPass
            }
        }
    }

    // add payment and attendance
    for (const row of data.rows) {
        const unattended = row.student_data.attendance.filter( a => a.attended == 0)
        const amountPaid = row.student_data.payments.reduce((acc, obj) => acc + Number(obj.amount), 0)
        row.attendance = unattended.length > 0 ? 'incomplete' : 'complete'
        row.payment = Number(row.student_data.price) > amountPaid ? 'incomplete' : 'complete'
    }

    // add theorical condition
    for (const row of data.rows) {
        row.theorical_enabled = row.payment == 'complete' && row.attendance == 'complete' ? true : false
    }

    // add practical status if applies

    // filter data

    // get pages
    const pages = Math.ceil(data.count / limit)
    data.pages = pages

    return data

    
}

module.exports = getStudentsExams