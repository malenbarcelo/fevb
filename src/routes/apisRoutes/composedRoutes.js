const express = require('express')
const coursesController = require('../../controllers/apisControllers/composedCoursesController')
const inscriptionsController = require('../../controllers/apisControllers/composedInscriptionsController')
const datesController = require('../../controllers/apisControllers/composedDatesController')
const studentSessionController = require('../../controllers/apisControllers/composedStudentSessionController')
const examsController = require('../../controllers/apisControllers/composedExamsController')
const filesController = require('../../controllers/apisControllers/composedFilesController')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/files/personalDataLists'))  
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      const fileExtension = path.extname(file.originalname)
      const fileName = file.originalname.replace(fileExtension,'')   
      cb(null, fileName + '-' + uniqueSuffix + fileExtension)
    }
  })

const upload = multer({storage: storage})

///// courses
router.get('/courses/get-schedule-options',coursesController.getScheduleOptions)
router.get('/inscriptions/get-session',coursesController.getSession)

// files
router.post('/files/update-personal-data-list',upload.single('ulppFile'),filesController.uploadPersonalDataList)

///// dates
router.get('/get-week-and-day',datesController.getWeekAndDay)
router.get('/get-weeks-in-year',datesController.getWeeksInYear)
router.get('/get-last-n-weeks',datesController.getLastNweeks)

///// student session
router.get('/get-session-data',studentSessionController.getSessionData)

///// exams
router.get('/exams/theoricals/get-exam-images',examsController.getExamImages)
router.get('/exams/theoricals/get-exam-action',examsController.getExamAction)

///// inscriptions
router.post('/sync-bulk-inscriptions',inscriptionsController.syncBulkCreate)







module.exports = router



