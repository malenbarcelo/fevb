const examsTheoricalsQueries = require("../dbQueries/exams/examsTheoricalsQueries.js")
const examsPracticalsQueries = require("../dbQueries/exams/examsPracticalsQueries.js")
const studentsExamsQueries = require("../dbQueries/students/studentsExamsQueries.js")
const studentsExamsTheoricalsAnswersQueries = require("../dbQueries/students/studentsExamsTheoricalsAnswersQueries.js")
const studentsExamsPracticalsAnswersQueries = require("../dbQueries/students/studentsExamsPracticalsAnswersQueries.js")
const studentsCoursesExamsQueries = require("../dbQueries/students/studentsCoursesExamsQueries.js")
const examsTheoricalsQuestionsQueries = require("../dbQueries/exams/examsTheoricalsQuestionsQueries.js")
const examsPracticalsQuestionsQueries = require("../dbQueries/exams/examsPracticalsQuestionsQueries.js")

async function createExamsData(data) {

    const examsTheoricals = await examsTheoricalsQueries.get({filters:{enabled:1}})
    const examsPracticals = await examsPracticalsQueries.get({filters:{enabled:1}})

    // get data
    let {studentsCoursesExams, studentsExams} = await getData(data, examsTheoricals, examsPracticals)

    // create students exams
    studentsExams = await studentsExamsQueries.create(studentsExams)

    // get students courses exams
    studentsCoursesExams.forEach(sce => {
        const idStudentsExams = studentsExams.find( se => se.id_students == sce.id_students && se.id_exams_theoricals == sce.id_exams_theoricals && se.id_exams_practicals == sce.id_exams_practicals).id
        sce.id_students_exams = idStudentsExams        
    })

    // create students_courses_exams
    await studentsCoursesExamsQueries.create(studentsCoursesExams)

    // get exams questions
    const { theoricalAnswers, practicalAnswers } = getExamsAnswers(studentsExams, examsTheoricals, examsPracticals)
    await studentsExamsTheoricalsAnswersQueries.create(theoricalAnswers)
    await studentsExamsPracticalsAnswersQueries.create(practicalAnswers)

}

async function getData(data, examsTheoricals, examsPracticals) {

    // add exams hierarchy to data
    data.forEach(d => {
        d.theoricals_index = examsTheoricals.find( et => et.id == d.id_exams_theoricals).exam_index
        d.theoricals_hierarchy = examsTheoricals.find( et => et.id == d.id_exams_theoricals).hierarchy
        d.practicals_index = examsPracticals.find( ep => ep.id == d.id_exams_practicals) == null ? null : examsPracticals.find( ep => ep.id == d.id_exams_practicals).exam_index
        d.practicals_hierarchy = examsPracticals.find( ep => ep.id == d.id_exams_practicals) == null ? null : examsPracticals.find( ep => ep.id == d.id_exams_practicals).hierarchy        
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

    // get students courses exams
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

    // add version and variant
    studentsExams = await addVersionAndVariant(studentsExams)

    return { studentsCoursesExams, studentsExams}


}

async function addVersionAndVariant(studentsExams) {

    for (const s of studentsExams) {

        const lastTheoricalVersion = await examsTheoricalsQuestionsQueries.getLastVersion(s.id_exams_theoricals)
        let lastPracticalVersion
        
        if (s.id_exams_practicals != null) {
            lastPracticalVersion = await examsPracticalsQuestionsQueries.getLastVersion(s.id_exams_practicals)
            lastPracticalVersion = lastPracticalVersion.exam_practical_version
        }else{
            lastPracticalVersion = null
        }
        
        let variants = await examsTheoricalsQuestionsQueries.uniqueVariants({filters:{id_exams_theoricals:s.id_exams_theoricals,exam_theorical_version:lastTheoricalVersion.exam_theorical_version}})
        variants = variants.map( v => v.variants)
        const variant = variants[Math.floor(Math.random() * variants.length)]

        // add data to studentsExams
        s.exam_theorical_version =  lastTheoricalVersion.exam_theorical_version
        s.exam_theorical_variant = variant
        s.exam_practical_version =  lastPracticalVersion
        
    }

    return studentsExams

}

function getExamsAnswers(studentsExams, examsTheoricals, examsPracticals) {

    const theoricalAnswers = []
    const practicalAnswers = []

    for (const s of studentsExams) {

        // get theoricals questions
        const theoricalQuestions = examsTheoricals
                .find( e => e.id == s.id_exams_theoricals).questions
                .filter( q => q.exam_theorical_version == s.exam_theorical_version && q.exam_theorical_variant == s.exam_theorical_variant)

        theoricalQuestions.forEach(q => {
            theoricalAnswers.push({
                id_students: s.id_students,
                id_students_exams: s.id,
                id_exams_theoricals_questions: q.id
            })
        })

        // get practicals questions
        if (s.id_exams_practicals != null) {
            const practicalQuestions = examsPracticals
                .find( e => e.id == s.id_exams_practicals).questions
                .filter( q => q.exam_practical_version == s.exam_practical_version)

            practicalQuestions.forEach(q => {
                practicalAnswers.push({
                    id_students: s.id_students,
                    id_students_exams: s.id,
                    id_exams_practicals_questions: q.id
                })
            })
        }
    }

    return {theoricalAnswers, practicalAnswers}
}

module.exports = { createExamsData }
