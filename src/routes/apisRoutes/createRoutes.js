const express = require('express')
const createStudentsController = require('../../controllers/apisControllers/createStudentsController')

const router = express.Router()

// students
router.post('/students/practicals-answers',createStudentsController.practicalsAnswers)
router.post('/students/practicals-answers-details',createStudentsController.practicalsAnswersDetails)
router.post('/students/practicals-answers-observations',createStudentsController.practicalsAnswersObservations)



module.exports = router



