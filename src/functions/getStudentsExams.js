
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const examsPracticalsQuestionsQueries = require("../dbQueries/exams/examsPracticalsQuestionsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")

async function getStudentsExams({limit,offset,filters}) {

    const data = await studentsExamsQueries.get({limit,offset,filters})

    // add status
    data.rows.forEach(row => {
        const missing = row.student_data.attendance.filter( a => a.attended == 0)
        const amountPaid = row.student_data.payments.reduce((acc, obj) => acc + Number(obj.amount), 0)
        row.attendance = missing.length > 0 ? 'incomplete' : 'complete'
        row.payment = Number(row.student_data.price) > amountPaid ? 'incomplete' : 'complete'
        row.status = row.payment == 'incomplete' ? 'Pago incompleto' : (row.attendance == 'incomplete' ? 'Curso incompleto' : (row.theoricals_status != 'passed' ? 'Teórico incompleto' : 'Habilitado' ))
        row.theoricalsEnabled = (row.payment == 'complete' && row.attendance == 'complete')
    })

    // add exams versions
    for (let i = 0; i < data.rows.length; i++) {
        const lastPracticalVersion = await examsPracticalsQuestionsQueries.getLastVersion(data.rows[i].id_exams_practicals)
        const lastTheoricalVersion = await examsTheoricalsQuestionsQueries.getLastVersion(data.rows[i].id_exams_theoricals)
        data.rows[i].lastPracticalVersion = lastPracticalVersion ? lastPracticalVersion.exam_practical_version : null
        data.rows[i].lastTheoricalVersion = lastTheoricalVersion ? lastTheoricalVersion.exam_theorical_version : null
    }

    // get pages
    const pages = Math.ceil(data.count / limit)
    data.pages = pages

    return data

    
}

module.exports = getStudentsExams