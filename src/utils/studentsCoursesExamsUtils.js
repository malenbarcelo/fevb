const studentsCoursesExamsQueries = require("../dbQueries/students/studentsCoursesExamsQueries.js")
const getStudentsExams = require("./studentsExamsUtils.js")

async function getStudentsCoursesExams({limit,offset,filters}) {

    // get students exams
    const data = await studentsCoursesExamsQueries.get({limit,offset,filters})

    // get students exams
    const idsStudents = [...new Set(data.rows.map(d => d.id_students))]
    const studentsExams = await getStudentsExams({undefined,undefined,filters:{id_students:idsStudents}})

    const examsMap = new Map(
        studentsExams.rows.map(e => {
            const {
                exam_theorical_questions,
                theoricals_answers,
                practicals_answers,
                student_data,
                ...cleanExam
            } = e

            return [e.id, cleanExam]
        })
    )

    data.rows = data.rows.map(d => ({
        ...d,
        exams_results: examsMap.get(d.id_students_exams) || null
    }))

    // add filters
    if (filters.repre) {
        if (filters.repre == 'enabled') {
            data.rows = data.rows.filter(d => 
                d.exams_results.theorical_status == 'passed' &&
                (d.exams_results.practical_status == 'passed' || d.exams_results.practical_status === null) &&
                d.exams_results.payment == 'complete' &&
                d.exams_results.attendance == 'complete' &&
                d.uploaded_repre != null &&
                d.uploaded_repre != 1
            )
        }
        if (filters.repre == 'disabled') {
            data.rows = data.rows.filter(d => 
                (d.exams_results.theorical_status != 'passed' ||
                (d.exams_results.practical_status != 'passed' && d.exams_results.practical_status != null) ||
                d.exams_results.payment == 'incomplete' ||
                d.exams_results.attendance == 'incomplete') &&
                d.uploaded_repre != null
            )
        }
    }

    // get pages
    const pages = Math.ceil(data.count / limit)
    data.pages = pages

    return data

    
}

module.exports = getStudentsCoursesExams