
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const examsPracticalsQuestionsQueries = require("../dbQueries/exams/examsPracticalsQuestionsQueries.js")

async function getStudentsExams({limit,offset,filters}) {

    // get students exams
    const data = await studentsExamsQueries.get({limit,offset,filters})

    // get exams questions
    const idsExamsTheoricals = data.rows.map( r => r.id_exams_theoricals)
    const idsExamsPracticals = data.rows.map( r => r.id_exams_practicals)
    const theoricalQuestions = await examsTheoricalsQuestionsQueries.get({filters:{id_exams_theoricals:idsExamsTheoricals}})
    const practicalQuestions = await examsPracticalsQuestionsQueries.get({filters:{id_exams_practicals:idsExamsPracticals}})

    // add payment and attendance
    for (const row of data.rows) {
        const unattended = row.student_data.attendance.filter( a => a.attended == 0)
        const amountPaid = row.student_data.payments.reduce((acc, obj) => acc + Number(obj.amount), 0)
        row.attendance = unattended.length > 0 ? 'incomplete' : 'complete'
        row.payment = Number(row.student_data.price) > amountPaid ? 'incomplete' : 'complete'
    }

    ///// THEORICAL
    // add theorical questions and pass grade
    for (const row of data.rows) {
        const examTheoricalsQuestions = theoricalQuestions.filter( q => q.id_exams_theoricals == row.id_exams_theoricals && q.exam_theorical_version == row.exam_theorical_version && q.exam_theorical_variant == row.exam_theorical_variant)
        row.exam_theorical_questions = examTheoricalsQuestions
        row.theorical_pass_grade = row.exam_theorical_data.pass_grade
        row.theorical_date = row.theoricals_answers[row.theoricals_answers.length - 1].date
    }

    // add theorical status
    for (const row of data.rows) {
        const theoricalAnswersQty = row.theoricals_answers.length
        const nullAnswers = row.theoricals_answers.filter( a => a.ids_selected_options == null).length

        if (theoricalAnswersQty == nullAnswers) {
            row.theorical_status = 'pending'
            row.theorical_grade = null        
        }else{
            if (nullAnswers > 0) {
                row.theorical_status = 'in-progress'
                row.theorical_grade = null
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

                const answersToPass = Math.ceil(Number(row.theorical_pass_grade) * theoricalAnswersQty)

                const grade = correctAnswers / theoricalAnswersQty
                row.theorical_grade = grade
                row.theorical_questions = theoricalAnswersQty
                row.correct_answers = correctAnswers                
                row.theorical_status = grade >= Number(row.theorical_pass_grade) ? 'passed' : 'not-passed' 
                row.answers_to_pass = answersToPass
            }
        }
    }

    ///// PRACTICAL
    // add practical questions and pass grade
    for (const row of data.rows) {
        const examPracticalsQuestions = row.id_exams_practicals == null ? null : practicalQuestions.filter( q => q.id_exams_practicals == row.id_exams_practicals && q.exam_practical_version == row.exam_practical_version)
        row.exam_practical_questions = examPracticalsQuestions
        row.practical_pass_grade = row.id_exams_practicals == null ? null : row.exam_practical_data.pass_grade
        row.practical_date = row.id_exams_practicals == null ? null : row.practicals_answers[row.practicals_answers.length - 1].date
    }
    // add practical status
    for (const row of data.rows) {
        const practicalAnswersQty = row.id_exams_practicals == null ? null : row.practicals_answers.length
        const nullAnswers = row.id_exams_practicals == null ? null : row.practicals_answers.filter( a => a.correct_answer === null).length

        if (practicalAnswersQty == nullAnswers) {
            row.practical_status = row.id_exams_practicals == null ? null : 'pending'
            row.practical_grade = null
        }else{
            if (nullAnswers > 0) {
                row.practical_status = row.id_exams_practicals == null ? null : 'in-progress'
                row.practical_grade = null
            }else{ // all questions answered
                const resultsAnswers = row.id_exams_practicals == null ? null : row.practicals_answers.filter( a => a.question_data.stage_number == 4)
                const correctAnswers = row.id_exams_practicals == null ? null : resultsAnswers.filter( r => r.correct_answer == 1)
                const passGrade = row.id_exams_practicals == null ? null : Number(row.exam_practical_data.pass_grade)
                const grade = row.id_exams_practicals == null ? null : correctAnswers.length / resultsAnswers.length
                row.practical_grade = row.id_exams_practicals == null ? null : grade
                row.practical_status = row.id_exams_practicals == null ? null : grade >= passGrade ? 'passed' : 'not-passed' 
            }
        }
    }

    // add theorical and practical condition
    for (const row of data.rows) {
        row.theorical_enabled = row.payment == 'complete' && row.attendance == 'complete' ? true : false
        row.practical_enabled = row.id_exams_practicals == null ? null : (row.payment == 'complete' && row.attendance == 'complete' ? true : false)
    }

    // filter data
    if (filters.theoricals_status) {
        data.rows = data.rows.filter(d => filters.theoricals_status.includes(d.theorical_status))
    }
    if (filters.practicals_status) {
        data.rows = data.rows.filter(d => filters.practicals_status.includes(d.practical_status))
    }
    if (filters.id_courses_types) {
        data.rows = data.rows.filter(d => d.student_data.id_courses_types == filters.id_courses_types)
    }
    if (filters.name) {
        data.rows = data.rows.filter(d =>
            (d.student_data.first_name.toLowerCase() + ' ' + d.student_data.last_name.toLowerCase())
                .toLowerCase()
                .includes(filters.name.toLowerCase())
        )
    }
    if (filters.cuit_cuil_string) {
        data.rows = data.rows.filter(d => String(d.student_data.cuit_cuil).includes(String(filters.cuit_cuil_string)))
    }

    // get pages
    const pages = Math.ceil(data.count / limit)
    data.pages = pages

    return data

    
}

module.exports = getStudentsExams