
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const examsPracticalsQuestionsQueries = require("../dbQueries/exams/examsPracticalsQuestionsQueries.js")

async function getStudentsExams({limit,offset,filters}) {

    // get students exams
    const data = await studentsExamsQueries.get({limit,offset,filters})

    // add exams enabled status
    for (const row of data.rows) {
        row.theorical_enabled = (row.student_data.attendance_status == 'complete' && row.student_data.payment_status == 'complete') ? 1 : 0
        row.practical_enabled = (row.student_data.attendance_status == 'complete' && row.student_data.payment_status == 'complete') ? 1 : 0
    }

    // get pages
    const pages = Math.ceil(data.count / limit)
    data.pages = pages

    return data
    
}

module.exports = getStudentsExams