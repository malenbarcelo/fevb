const examsPracticalsTeachersQueries = require("../../dbQueries/exams/examsPracticalsTeachersQueries.js")
const studentsPracticalsAnswersObservationsQueries = require("../../dbQueries/students/studentsPracticalsAnswersObservationsQueries.js")
const examsPracticalsQueries = require("../../dbQueries/exams/examsPracticalsQueries.js")
const studentsExamsPracticalsAnswersQueries = require("../../dbQueries/students/studentsExamsPracticalsAnswersQueries.js")
const typesQueries = require("../../dbQueries/courses/typesQueries.js")
const getStudentsExams = require("../../utils/studentsExamsUtils.js")

const practicalControllers = {
    // complete practical
    practical: async(req,res) => {
        try{

            const teachers = await examsPracticalsTeachersQueries.get({filters:{}})
            const exams = await examsPracticalsQueries.get({filters:{order:[["exam_name","ASC"]]}})
            let coursesTypes =  await typesQueries.get({filters:{enabled:1}})
            coursesTypes.sort((a, b) => a.alias.localeCompare(b.alias))

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
            const studentExam = await getStudentsExams({undefined,undefined,filters:{id:id}})
            const data = studentExam.rows[0]
            
            // teachers
            const teachers = await examsPracticalsTeachersQueries.get({filters:{}})

            // exam data
            const questions = data.exam_practical_questions
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
            const options = [{type:1,option:'Correcto'},{type:0,option:'Incorrecto'}]
            return res.render('exams/practicals/studentPractical',{title:'FEVB - Exámenes', data, teachers, options,stagesQuestions})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    // student practical process
    studentPracticalProcess: async(req,res) => {

        try{
            const idStudentsExams = req.params.idStudentsExams
            let studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})
            const data = req.body

            // date
            const date = new Date()
            date.setHours(date.getHours() - 3) // Argentina
            

            // save answers
            const resultsAnswers = Object.fromEntries(
                Object.entries(data).filter(([key]) => key.startsWith('stage_'))
            )

            let answers = Object.entries(resultsAnswers).map(([key, value]) => ({
                id_students: studentExam.rows[0].id_students,
                id_students_exams: Number(idStudentsExams),
                id_exams_practicals_questions: Number(key.split('_')[3]),
                correct_answer: Number(value.split('_').pop()),
                date: date
            }))

            answers = answers.map(a => ({
                id_students: a.id_students,
                id_students_exams: a.id_students_exams,
                id_exams_practicals_questions: a.id_exams_practicals_questions,
                dataToUpdate: {
                    correct_answer: a.correct_answer,
                    date: a.date
                }
            }))

            await studentsExamsPracticalsAnswersQueries.update('student_exam_question',answers)

            // save observations
            const observationsKeys = Object.keys(data).filter(key => 
                key.includes('obs_')
            )

            const obs = []

            observationsKeys.forEach(key => {
                obs.push({
                    id_students_exams: Number(idStudentsExams),
                    stage_number: key.includes('_stage_') ? Number(key.split('_')[2]) : null,
                    observation: data[key]
                })
            })
            
            await studentsPracticalsAnswersObservationsQueries.create(obs)

            // get answer
            studentExam = await getStudentsExams({undefined,undefined,filters:{id:idStudentsExams}})
            const status = studentExam.rows[0].practical_status
            
            // render results
            return res.render('exams/practicals/practicalResult',{title:'FEVB - Exámenes',status})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}
module.exports = practicalControllers

