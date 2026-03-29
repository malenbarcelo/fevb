
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const examsPracticalsQuestionsQueries = require("../dbQueries/exams/examsPracticalsQuestionsQueries.js")

async function getStudentsExams({limit,offset,filters}) {

    // get students exams
    const data = await studentsExamsQueries.get({limit,offset,filters})

    // add payment and attendance
    for (const row of data.rows) {
        const unattended = row.student_data.attendance.filter( a => a.attended == 0)
        const amountPaid = row.student_data.payments.reduce((acc, obj) => acc + Number(obj.amount), 0)
        row.attendance = unattended.length > 0 ? 'incomplete' : 'complete'
        row.payment = Number(row.student_data.price) > amountPaid ? 'incomplete' : 'complete'
        row.theorical_enabled = (row.attendance == 'complete' && row.payment == 'complete') ? 1 : 0
        row.practical_enabled = (row.attendance == 'complete' && row.payment == 'complete') ? 1 : 0
    }

    // get pages
    const pages = Math.ceil(data.count / limit)
    data.pages = pages

    return data
    
}

module.exports = getStudentsExams