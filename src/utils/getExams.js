const coursesQueries = require("../dbQueries/courses/coursesQueries.js")
const examsTheoricalsQueries = require("../dbQueries/exams/examsTheoricalsQueries.js")

async function getTheoricals(data) {

    const courses = await coursesQueries.get({filters:{enabled:1}})
    const examsTheoricals = await examsTheoricalsQueries.get({filters:{enabled:1}})
    const studentsExams = []

    data.forEach(d => {
        const studentCourses = courses.filter(c => d.id_courses.includes(c.id))
        const studentTheoricals = studentCourses.map( sc => sc.id_exams_theoricals)
        const theoricalsData = studentTheoricals.filter
        console.log(theoricals)
        
    });

    //return examsTheoricals

}

module.exports = { getTheoricals }
