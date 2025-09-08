const express = require('express')
const coursesController = require('../../controllers/apisControllers/composedCoursesController')
const plController = require('../../controllers/apisControllers/composedPlController') // eliminar

const router = express.Router()

///// courses
router.get('/courses/get-schedule-options',coursesController.getScheduleOptions)
router.get('/inscriptions/get-session',coursesController.getSession)



// /////
// router.get('/professional-licences/get-schedule',plController.getSchedule)
// router.post('/professional-licences/download-attendance-list',plController.downloadAttendanceList)

// // session
// router.get('/professional-licences/get-session',plController.getSession)



module.exports = router



