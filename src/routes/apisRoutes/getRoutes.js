const express = require('express')
const getCoursesController = require('../../controllers/apisControllers/getCoursesController')
const getStudentsController = require('../../controllers/apisControllers/getStudentsController')
const getExamsController = require('../../controllers/apisControllers/getExamsController')
const getBranchesController = require('../../controllers/apisControllers/getBranchesController')
const getDatesController = require('../../controllers/apisControllers/getDatesController')

const router = express.Router()

///// branches
router.get('/branches',getBranchesController.branches)

///// courses
router.get('/courses/types',getCoursesController.types)
router.get('/courses',getCoursesController.courses)
router.get('/courses/schedule',getCoursesController.schedule)
router.get('/courses/prices',getCoursesController.prices)
router.get('/courses/additional-per-category',getCoursesController.addionalPerCategory)

///// students
router.get('/students',getStudentsController.students)
router.get('/students-courses-exams',getStudentsController.studentsCoursesExams)
router.get('/students-exams',getStudentsController.studentsExams)
router.get('/students-exams-theoricals-answers',getStudentsController.studentsExamsTheoricalsAnswers)

///// exams
router.get('/exams-theoricals-questions',getExamsController.examsTheoricalsQuestions)
//router.get('/exams/practicals/questions',getExamsController.examsPracticalsQuestions)

///// dates
router.get('/dates',getDatesController.dates)





module.exports = router



