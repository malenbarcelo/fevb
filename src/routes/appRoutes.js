const express = require('express')
const adminController = require('../controllers/adminController.js')
const examsController = require('../controllers/examsController.js')
const inscriptionsController = require('../controllers/inscriptions/inscriptionsController.js')
const hazardousMaterialsController = require('../controllers/inscriptions/hazardousMaterialsController.js')
const professionalLicencesController = require('../controllers/inscriptions/professionalLicencesController.js')

const router = express.Router()

///// admin
router.get('/',adminController.login)
router.post('/login',adminController.loginProcess)

///// inscriptions
router.get('/inscripciones/gestion',adminController.inscManagement)
router.get('/inscripciones',inscriptionsController.mainMenu)
router.post('/inscripciones/tipos-de-cursos',inscriptionsController.setCourseType)
router.get('/inscripciones/manejo-defensivo',inscriptionsController.selectCourse)
router.get('/inscripciones/mercancias-peligrosas',inscriptionsController.selectCourse)
router.get('/inscripciones/cursos',inscriptionsController.selectCourse)
router.post('/inscripciones/cursos',inscriptionsController.setCourses)
router.get('/inscripciones/licencias-profesionales',professionalLicencesController.types)
router.post('/inscripciones/licencias-profesionales/tipos',professionalLicencesController.setTypes)
router.get('/inscripciones/licencias-profesionales/cursos',professionalLicencesController.courses)
router.get('/inscripciones/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscripciones/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscripciones/cronograma',inscriptionsController.schedule)
router.post('/inscripciones/cronograma',inscriptionsController.setSchedule)
router.get('/inscripciones/datos-personales',inscriptionsController.personalData)
router.post('/inscripciones/datos-personales',inscriptionsController.setPersonalData)
router.get('/inscripciones/confirmar-inscripcion',inscriptionsController.checkout)
router.post('/inscripciones/confirmar-inscripcion',inscriptionsController.saveInscription)

///// professional licences
router.get('/professional-licences/inscriptions',professionalLicencesController.redirect) // redirect old route

///// exams
router.get('/examenes/ingresar',examsController.ingresar)
router.get('/examenes/login',examsController.login)
router.post('/examenes/login',examsController.setStudentData)
router.get('/examenes/logout',examsController.logout)
router.get('/examenes/pendientes',examsController.pendingExams)
router.post('/examenes/set-exam',examsController.setExam)
router.get('/examenes/resultado',examsController.examResult)
router.get('/examenes/preguntas',examsController.exam)
router.get('/examenes/ver-respuestas',examsController.examAnswers)



module.exports = router



