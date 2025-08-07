const express = require('express')
const plController = require('../../controllers/apisControllers/composedPlController')

const router = express.Router()

router.get('/professional-licences/get-schedule',plController.getSchedule)
router.post('/professional-licences/download-attendance-list',plController.downloadAttendanceList)



module.exports = router



