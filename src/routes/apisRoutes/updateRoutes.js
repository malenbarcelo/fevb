const updateStudentsController = require('../../controllers/apisControllers/updateStudentsController')
const express = require('express')

const router = express.Router()

///// students
router.post('/students-answers-details',updateStudentsController.studentsAnswersDetails)



module.exports = router



