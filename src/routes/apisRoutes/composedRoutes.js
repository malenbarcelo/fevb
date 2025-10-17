const express = require('express')
const coursesController = require('../../controllers/apisControllers/composedCoursesController')

const router = express.Router()

///// courses
router.get('/courses/get-schedule-options',coursesController.getScheduleOptions)
router.get('/inscriptions/get-session',coursesController.getSession)
router.get('/get-week-and-day',coursesController.getWeekAndDay)
router.get('/get-weeks-in-year',coursesController.getWeeksInYear)

module.exports = router



