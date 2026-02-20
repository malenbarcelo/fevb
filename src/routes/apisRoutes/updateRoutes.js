const updateStudentsController = require('../../controllers/apisControllers/updateStudentsController')
const express = require('express')

const router = express.Router()

///// students
router.post('/students',updateStudentsController.students)
router.post('/students/exams',updateStudentsController.studentsExams)
router.post('/students/payments',updateStudentsController.studentsPayments)
router.post('/students-exams-theoricals-answers',updateStudentsController.studentsExamsTheoricalsAnswers)




module.exports = router



