const express = require('express')
const getCoursesController = require('../../controllers/apisControllers/getCoursesController')
const getStudentsController = require('../../controllers/apisControllers/getStudentsController')

const router = express.Router()

///// courses
router.get('/courses/types',getCoursesController.types)
router.get('/courses',getCoursesController.courses)
router.get('/courses/schedule',getCoursesController.schedule)
router.get('/courses/prices',getCoursesController.prices)
router.get('/courses/additional-per-category',getCoursesController.addionalPerCategory)

///// students
router.get('/students',getStudentsController.students)


module.exports = router



