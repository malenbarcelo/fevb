const express = require('express')
const getCoursesController = require('../../controllers/apisControllers/getCoursesController')
const getStudentsController = require('../../controllers/apisControllers/getStudentsController')
const getExamsController = require('../../controllers/apisControllers/getExamsController')
const getBranchesController = require('../../controllers/apisControllers/getBranchesController')

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

///// students exams
router.get('/students-exams',getStudentsController.studentsExams)

///// exams
router.get('/exams/theoricals/questions',getExamsController.examsTheoricalsQuestions)
router.get('/exams/practicals/questions',getExamsController.examsPracticalsQuestions)





module.exports = router



