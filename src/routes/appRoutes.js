const express = require('express')
const mainController = require('../controllers/mainController.js')
const adminController = require('../controllers/adminController.js')
const practicalController = require('../controllers/exams/practicalController.js')
const theoricalController = require('../controllers/exams/theoricalController.js')
const inscriptionsController = require('../controllers/inscriptions/inscriptionsController.js')
const hazardousMaterialsController = require('../controllers/inscriptions/hazardousMaterialsController.js')
const professionalLicencesController = require('../controllers/inscriptions/professionalLicencesController.js')
const loginFormValidations = require('../validations/loginFormValidations.js')

const router = express.Router()

///// main
router.get('/',mainController.main)
router.get('/login',mainController.login)
router.post('/login',loginFormValidations.login,mainController.loginProcess)
router.get('/logout',mainController.logout)
router.get('/menu',mainController.mainMenu)

///// administracion
router.get('/administracion/menu',adminController.menu)
router.get('/administracion/asincronicos/alumnos',adminController.asyncStudents)
router.get('/administracion/sincronicos/alumnos',adminController.syncStudents)

///// inscriptions
router.get('/inscripciones',inscriptionsController.mainMenu)
router.post('/inscripciones/tipos-de-cursos',inscriptionsController.setCourseType)
router.get('/inscripciones/manejo-defensivo',inscriptionsController.selectCourse)
router.get('/inscripciones/mercancias-peligrosas',inscriptionsController.selectCourse)
router.get('/inscripciones/seguridad-privada',inscriptionsController.selectCourse)
//router.get('/inscripciones/seguridad-privada',inscriptionsController.notAvailableCourse)
router.get('/inscripciones/cursos',inscriptionsController.selectCourse)
router.post('/inscripciones/cursos',inscriptionsController.setCourses)
router.get('/inscripciones/licencias-profesionales',professionalLicencesController.types)
router.post('/inscripciones/licencias-profesionales/tipos',professionalLicencesController.setTypes)
router.get('/inscripciones/licencias-profesionales/cursos',professionalLicencesController.courses)
router.get('/inscripciones/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscripciones/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscripciones/cronograma',inscriptionsController.schedule)
router.post('/inscripciones/cronograma',inscriptionsController.setSchedule)
router.get('/inscripciones/inscripcion-masiva/tipo-de-inscripcion',inscriptionsController.inscriptionType)
router.post('/inscripciones/inscripcion-masiva/tipo-de-inscripcion',inscriptionsController.setInscriptionType)
router.get('/inscripciones/datos-personales',inscriptionsController.personalData)
router.get('/inscripciones/empresas/empresa',inscriptionsController.companyData)
router.post('/inscripciones/empresas/empresa',inscriptionsController.setCompanyData)
router.get('/inscripciones/empresas/datos-personales',inscriptionsController.personalDataCompanies)
router.post('/inscripciones/datos-personales',inscriptionsController.setPersonalData)
router.get('/inscripciones/confirmar-inscripcion',inscriptionsController.checkout)
router.post('/inscripciones/confirmar-inscripcion',inscriptionsController.saveInscription)

///// professional licences
router.get('/professional-licences/inscriptions',professionalLicencesController.redirect) // redirect old route

///// theorical exams
router.get('/cuestionarios',theoricalController.ingresar)
router.get('/cuestionarios/login',theoricalController.login)
router.post('/cuestionarios/login',theoricalController.setStudentData)
router.get('/cuestionarios/logout',theoricalController.logout)
router.get('/cuestionarios/pendientes',theoricalController.pendingExams)
router.post('/cuestionarios/set-exam',theoricalController.setExam)
router.get('/cuestionarios/preguntas',theoricalController.exam)
router.get('/cuestionarios/resultado',theoricalController.examResult)
router.get('/cuestionarios/ver-respuestas',theoricalController.examAnswers)
router.get('/cuestionarios/rehacer',theoricalController.retakeExam)

//// practical exams
//router.get('/examenes/practicos',practicalController.practical)
//router.get('/examenes/teoricos',practicalController.practical)
router.get('/examenes/examen-practico',practicalController.completePractical)
router.get('/examenes/examen-practico/:idStudentsExams',practicalController.studentPractical)
router.post('/examenes/examen-practico/:idStudentsExams',practicalController.studentPracticalProcess)

module.exports = router



