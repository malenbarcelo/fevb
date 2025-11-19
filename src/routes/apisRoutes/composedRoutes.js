const express = require('express')
const coursesController = require('../../controllers/apisControllers/composedCoursesController')
const datesController = require('../../controllers/apisControllers/composedDatesController')
const studentSessionController = require('../../controllers/apisControllers/composedStudentSessionController')
const examsController = require('../../controllers/apisControllers/composedExamsController')

const router = express.Router()

///// courses
router.get('/courses/get-schedule-options',coursesController.getScheduleOptions)
router.get('/inscriptions/get-session',coursesController.getSession)

///// dates
router.get('/get-week-and-day',datesController.getWeekAndDay)
router.get('/get-weeks-in-year',datesController.getWeeksInYear)
router.get('/get-last-n-weeks',datesController.getLastNweeks)

///// student session
router.get('/get-session-data',studentSessionController.getSessionData)

///// exams
router.get('/get-exam-images',examsController.getExamImages)
router.get('/get-exam-action',examsController.getExamAction)





module.exports = router



