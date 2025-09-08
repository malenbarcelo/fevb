const express = require('express')
const getCoursesController = require('../../controllers/apisControllers/getCoursesController')
const getPlController = require('../../controllers/apisControllers/getPlController')

const router = express.Router()

///// courses
router.get('/courses/types',getCoursesController.types)
router.get('/courses',getCoursesController.courses)
router.get('/courses/schedule',getCoursesController.schedule)
router.get('/courses/prices',getCoursesController.prices)
router.get('/courses/additional-per-category',getCoursesController.addionalPerCategory)

///// professional licences
// router.get('/professional-licences/types',getPlController.types)
// router.get('/professional-licences/categories',getPlController.categories)
// router.get('/professional-licences/types-categories-prices',getPlController.typesCategoriesPrices)
// router.get('/professional-licences/additional-per-category',getPlController.addionalPerCategory)
// router.get('/professional-licences/students',getPlController.students)


module.exports = router



