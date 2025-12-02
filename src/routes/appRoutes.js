const express = require('express')
const adminController = require('../controllers/adminController.js')
const practicalController = require('../controllers/practicalController.js')
const theoricalController = require('../controllers/theoricalController.js')
const inscriptionsController = require('../controllers/inscriptions/inscriptionsController.js')
const hazardousMaterialsController = require('../controllers/inscriptions/hazardousMaterialsController.js')
const professionalLicencesController = require('../controllers/inscriptions/professionalLicencesController.js')

const router = express.Router()

///// admin
router.get('/',adminController.main)
router.get('/login',adminController.login)
router.post('/login',adminController.loginProcess)
router.get('/menu',adminController.mainMenu)

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

// ///// theorical exams
// router.get('/cuestionarios',theoricalController.ingresar)
// router.get('/cuestionarios/login',theoricalController.login)
// router.post('/cuestionarios/login',theoricalController.setStudentData)
// router.get('/cuestionarios/logout',theoricalController.logout)
// router.get('/cuestionarios/pendientes',theoricalController.pendingExams)
// router.post('/cuestionarios/set-exam',theoricalController.setExam)
// router.get('/cuestionarios/preguntas',theoricalController.exam)
// router.get('/cuestionarios/resultado',theoricalController.examResult)
// router.get('/cuestionarios/ver-respuestas',theoricalController.examAnswers)

// //// practical exams
// //router.get('/examenes/practicos',practicalController.practical)
// //router.get('/examenes/teoricos',practicalController.practical)
// router.get('/examenes/examen-practico',practicalController.completePractical)

module.exports = router



