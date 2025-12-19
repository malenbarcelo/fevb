const examsPracticalsTeachersQueries = require("../../dbQueries/exams/examsPracticalsTeachersQueries.js")
const studentsPracticalsAnswersQueries = require("../../dbQueries/students/studentsPracticalsAnswersQueries.js")
const studentsPracticalsAnswersObservationsQueries = require("../../dbQueries/students/studentsPracticalsAnswersObservationsQueries.js")
const studentsPracticalsAnswersDetailsQueries = require("../../dbQueries/students/studentsPracticalsAnswersDetailsQueries.js")
const examsPracticalsQueries = require("../../dbQueries/exams/examsPracticalsQueries.js")
const examsPracticalsQuestionsQueries = require("../../dbQueries/exams/examsPracticalsQuestionsQueries.js")
const examsPracticalsOptionsQueries = require("../../dbQueries/exams/examsPracticalsOptionsQueries.js")
const studentsExamsQueries = require("../../dbQueries/students/studentsExamsQueries.js")

const practicalControllers = {
    // complete practical
    completePractical: async(req,res) => {
        try{

            const teachers = await examsPracticalsTeachersQueries.get({filters:{}})
            const exams = await examsPracticalsQueries.get({filters:{order:[["exam_name","ASC"]]}})
            let coursesTypes =  [...new Set(exams.map( e => e.courses_types_alias))]
            coursesTypes.sort((a, b) => a.localeCompare(b))

            return res.render('exams/practicals/pendingExams',{title:'FEVB - Exámenes', teachers, exams, coursesTypes})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // student practical
    studentPractical: async(req,res) => {
        try{

            //students exams data
            const id = req.params.idStudentsExams
            const studensExamsData = await studentsExamsQueries.get({undefined, undefined, filters:{id:id}})
            const data = studensExamsData.rows[0]
            
            // teachers
            const teachers = await examsPracticalsTeachersQueries.get({filters:{}})

            // exam data
            const idExamsPracticals = data.exam_practical_data.id
            const lastVersion =  await examsPracticalsQuestionsQueries.getLastVersion(idExamsPracticals)
            const filters = {
                id_exams_practicals: idExamsPracticals,
                exam_practical_version: lastVersion.exam_practical_version,
                order: [["stage_number","ASC"],["question_number","ASC"]]
            }
            const questions = await examsPracticalsQuestionsQueries.get({filters})
            const stagesQuestions = []

            // structured info
            let stages = questions.map(q => ({
                stage_number: q.stage_number,
                stage_name: q.stage_name
            }))
        
            stages = [
                ...new Map(
                    stages.map(s => [s.stage_number, s])
                ).values()
            ]

            stages.forEach(stage => {
                const stageQuestions = questions.filter( q => q.stage_number == stage.stage_number)
                stagesQuestions.push({stage_name:stage.stage_name, stage_number: stage.stage_number,questions:stageQuestions})
            })

            // render form
            return res.render('exams/practicals/studentPractical',{title:'FEVB - Exámenes', data, teachers, stagesQuestions})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // student practical process
    studentPracticalProcess: async(req,res) => {

        try{
            const idStudentsExams = req.params.idStudentsExams
            const data = req.body
            let studensExamsData = await studentsExamsQueries.get({undefined, undefined, filters:{id:idStudentsExams}})
            studensExamsData = studensExamsData.rows[0]
            const lastVersion =  await examsPracticalsQuestionsQueries.getLastVersion(studensExamsData.id_exams_practicals)
            
            // get not passed answers
            const notPassedKeys = Object.keys(data).filter(key => 
                String(data[key]).includes('_notPassed_')
            )

            // get questions keys
            const questionsKeys = Object.keys(data).filter(key => 
                String(data[key]).includes('question_')
            )

            // date
            const date = new Date()
            date.setHours(date.getHours() - 3) // Argentina

            // create students practicals answers
            const dataToCreate = [{
                id_students_exams: Number(idStudentsExams),
                id_students: studensExamsData.id_students,
                id_teachers: Number(data.teacher.split('_')[1]),
                id_exams_practicals: studensExamsData.id_exams_practicals,
                exam_practical_version: lastVersion.exam_practical_version,
                status: notPassedKeys.length > 0 ? 'not-passed' : 'passed',
                date
            }]

            const createdData = await studentsPracticalsAnswersQueries.create(dataToCreate)

            // create students practicals answers details
            const idQuestions = questionsKeys.map( qk => Number(qk.split('_')[1]))
            const optionsData = await examsPracticalsOptionsQueries.get({filters:{id_exams_practicals_questions:idQuestions}})
            const details = []

            questionsKeys.forEach(key => {

                const correctOption = optionsData.find( o => o.id_exams_practicals_questions == Number(key.split('_')[1]) && o.correct_option == 1)

                details.push({
                    id_students_exams: Number(idStudentsExams),
                    id_students_practicals_answers: createdData[0].id,
                    id_students: studensExamsData.id_students,
                    id_exams_practicals: studensExamsData.id_exams_practicals,
                    id_exams_practicals_questions: Number(data[key].split('_')[1]),
                    id_selected_option: Number(data[key].split('_')[3]),
                    id_correct_option: correctOption.id,
                    correct_answer: correctOption.id == Number(data[key].split('_')[3]) ? 1 : 0
                })
            })

            await studentsPracticalsAnswersDetailsQueries.create(details)

            // create students practicals answers observations
            // get observations keys
            const observationsKeys = Object.keys(data).filter(key => 
                key.includes('obs_')
            )

            const obs = []

            observationsKeys.forEach(key => {
                obs.push({
                    id_students_exams: Number(idStudentsExams),
                    id_students_practicals_answers: createdData[0].id,
                    observation_type: key.includes('_stage_') ? 'stage' : 'result',
                    stage_number: key.includes('_stage_') ? Number(key.split('_')[2]) : null,
                    observation: data[key]
                })
            })

            await studentsPracticalsAnswersObservationsQueries.create(obs)

            // update students exams
            const dataToUpdate = [{
                id: createdData[0].id_students_exams,
                dataToUpdate:{
                    id_students_practicals_answers: createdData[0].id,
                    practicals_status: createdData[0].status
                }
            }]

            await studentsExamsQueries.update('id',dataToUpdate)

            // render results
            return res.render('exams/practicals/practicalResult',{title:'FEVB - Exámenes'})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}
module.exports = practicalControllers

