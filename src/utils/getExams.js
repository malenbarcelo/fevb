const coursesQueries = require("../dbQueries/courses/coursesQueries.js")
const examsTheoricalsQueries = require("../dbQueries/exams/examsTheoricalsQueries.js")
const examsPracticalsQueries = require("../dbQueries/exams/examsPracticalsQueries.js")

async function getExams(data) {

    const courses = await coursesQueries.get({filters:{enabled:1}})
    const examsTheoricals = await examsTheoricalsQueries.get({filters:{enabled:1}})
    const examsPracticals = await examsPracticalsQueries.get({filters:{enabled:1}})
    
    const studentsExams = []

    // add exams hierarchy to data
    data.forEach(d => {
        d.theoricals_index = examsTheoricals.find( et => et.id == d.id_exams_theoricals).index
        d.theoricals_hierarchy = examsTheoricals.find( et => et.id == d.id_exams_theoricals).hierarchy
        d.practicals_index = examsPracticals.find( ep => ep.id == d.id_exams_practicals) == null ? null : examsPracticals.find( ep => ep.id == d.id_exams_practicals).index
        d.practicals_hierarchy = examsPracticals.find( et => et.id == d.id_exams_practicals) == null ? null : examsPracticals.find( et => et.id == d.id_exams_practicals).hierarchy        
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

    return data

    

}

module.exports = { getExams }
