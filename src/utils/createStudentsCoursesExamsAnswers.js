const examsTheoricalsQueries = require("../dbQueries/exams/examsTheoricalsQueries.js")
const examsPracticalsQueries = require("../dbQueries/exams/examsPracticalsQueries.js")
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const studentsCoursesExamsQueries = require("../dbQueries/students/studentsCoursesExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")

async function createStudentsCoursesExamsAnswers(data) {

    const examsTheoricals = await examsTheoricalsQueries.get({filters:{enabled:1}})
    const examsPracticals = await examsPracticalsQueries.get({filters:{enabled:1}})
    
    // add exams hierarchy to data
    data.forEach(d => {
        d.theoricals_index = examsTheoricals.find( et => et.id == d.id_exams_theoricals).exam_index
        d.theoricals_hierarchy = examsTheoricals.find( et => et.id == d.id_exams_theoricals).hierarchy
        d.practicals_index = examsPracticals.find( ep => ep.id == d.id_exams_practicals) == null ? null : examsPracticals.find( ep => ep.id == d.id_exams_practicals).exam_index
        d.practicals_hierarchy = examsPracticals.find( et => et.id == d.id_exams_practicals) == null ? null : examsPracticals.find( et => et.id == d.id_exams_practicals).exam_hierarchy        
    })

    // get max theoricals hierarchy for each exam
    const maxTheoricalsHierarchyByIndex = {}

    for (const item of data) {
        const idx = item.theoricals_index

        if (
            !maxTheoricalsHierarchyByIndex[idx] ||
            item.theoricals_hierarchy > maxTheoricalsHierarchyByIndex[idx].theoricals_hierarchy
        ) {
            maxTheoricalsHierarchyByIndex[idx] = item
        }
    }

    data = data.map(item => ({
        ...item,
        theoricals: maxTheoricalsHierarchyByIndex[item.theoricals_index].id_exams_theoricals
    }))

    // get max practicals hierarchy for each exam
    const maxPracticalsHierarchyByIndex = {}

    for (const item of data) {
        const idx = item.practicals_index

        if (idx === null) continue

        if (
            !maxPracticalsHierarchyByIndex[idx] ||
            item.practicals_hierarchy > maxPracticalsHierarchyByIndex[idx].practicals_hierarchy
        ) {
            maxPracticalsHierarchyByIndex[idx] = item
        }
    }

    data = data.map(item => ({
        ...item,
        practicals:
            item.practicals_index === null
            ? null
            : maxPracticalsHierarchyByIndex[item.practicals_index]?.id_exams_practicals ?? null
    }))

    // get students courss exams
    const studentsCoursesExams = data.map(item => ({
        id_students: item.id_students,
        id_courses: item.id_courses,
        id_exams_theoricals: item.theoricals,
        id_exams_practicals: item.practicals
    }))

    // get students exams
    let studentsExams = data.map(item => ({
        id_students: item.id_students,
        id_exams_theoricals: item.theoricals,
        id_exams_practicals: item.practicals
    }))

    // unique students exams
    studentsExams = [
        ...new Map(
            studentsExams.map(item => [
                `${item.id_students}-${item.id_exams_theoricals}-${item.id_exams_practicals}`,
                item
            ])
        ).values()
    ]

    // create students exams
    studentsExams = await studentsExamsQueries.create(studentsExams)

    // get students courses exams
    studentsCoursesExams.forEach(sce => {
        const idStudentsExams = studentsExams.find( se => se.id_students == sce.id_students && se.id_exams_theoricals == sce.id_exams_theoricals && se.id_exams_practicals == sce.id_exams_practicals).id
        sce.id_students_exams = idStudentsExams
        
    })

    // create students_courses_exams
    await studentsCoursesExamsQueries.create(studentsCoursesExams)

    // create exams_answers
    createExamsAnswers(studentsExams, examsTheoricals, examsPracticals)

}

async function createExamsAnswers(studentsExams, examsTheoricals, examsPracticals) {

    const dataToCreate = []
    console.log(studentsExams)
    
    for (const s of studentsExams) {
        
        const lastTheoricalVersion = await examsTheoricalsQuestionsQueries.getLastVersion(s.id_exams_theoricals)
        const theoricalsQuestions = examsTheoricals.find( e => e.id == s.id_exams_theoricals && s.exam_theorical_version == lastTheoricalVersion).questions
        console.log(theoricalsQuestions)
        for (const element of object) {
            
        }
        
    }

    

}

module.exports = { createStudentsCoursesExamsAnswers }
