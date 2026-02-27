const express = require('express')
const mainController = require('../controllers/mainController.js')
const redirectController = require('../controllers/redirectController.js')
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
router.get('/inscripciones',inscriptionsController.branches)
router.post('/inscripciones/branches',inscriptionsController.setBranch)
router.get('/inscripciones/:branchUrl/tipos-de-cursos',inscriptionsController.coursesTypes)
router.post('/inscripciones/:branchUrl/tipos-de-cursos',inscriptionsController.setCourseType)
router.get('/inscripciones/:branchUrl/manejo-defensivo',inscriptionsController.selectCourse)
router.get('/inscripciones/:branchUrl/mercancias-peligrosas',inscriptionsController.selectCourse)
//router.get('/inscripciones/:branchUrl/seguridad-privada',inscriptionsController.selectCourse)
router.get('/inscripciones/:branchUrl/seguridad-privada',inscriptionsController.notAvailableCourse)
router.get('/inscripciones/:branchUrl/cursos',inscriptionsController.selectCourse)
router.post('/inscripciones/:branchUrl/cursos',inscriptionsController.setCourses)



router.get('/inscripciones/:branchUrl/licencias-profesionales',professionalLicencesController.types)
router.post('/inscripciones/:branchUrl/licencias-profesionales/tipos',professionalLicencesController.setTypes)
router.get('/inscripciones/:branchUrl/licencias-profesionales/cursos',professionalLicencesController.courses)
router.get('/inscripciones/:branchUrl/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscripciones/:branchUrl/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscripciones/:branchUrl/cronograma',inscriptionsController.schedule)
router.post('/inscripciones/:branchUrl/cronograma',inscriptionsController.setSchedule)
router.get('/inscripciones/:branchUrl/inscripcion-masiva/tipo-de-inscripcion',inscriptionsController.inscriptionType)
router.post('/inscripciones/:branchUrl/inscripcion-masiva/tipo-de-inscripcion',inscriptionsController.setInscriptionType)
router.get('/inscripciones/:branchUrl/datos-personales',inscriptionsController.personalData)
router.get('/inscripciones/:branchUrl/empresas/empresa',inscriptionsController.companyData)
router.post('/inscripciones/:branchUrl/empresas/empresa',inscriptionsController.setCompanyData)
router.get('/inscripciones/:branchUrl/empresas/datos-personales',inscriptionsController.personalDataCompanies)
router.post('/inscripciones/:branchUrl/datos-personales',inscriptionsController.setPersonalData)
router.get('/inscripciones/:branchUrl/confirmar-inscripcion',inscriptionsController.checkout)
router.post('/inscripciones/:branchUrl/confirmar-inscripcion',inscriptionsController.saveInscription)

///// redirections
router.get('/professional-licences/inscriptions',redirectController.plRedirect) // redirect old route
router.get('/inscripciones/licencias-profesionales',redirectController.plRedirect) // redirect old route
router.get('/inscripciones/manejo-defensivo',redirectController.mdRedirect) // redirect old route
router.get('/inscripciones/mercancias-peligrosas',redirectController.mpRedirect) // redirect old route


///// theorical exams
router.get('/examenes',theoricalController.ingresar)
router.get('/examenes/login',theoricalController.login)
router.post('/examenes/login',theoricalController.setStudentData)
router.get('/examenes/logout',theoricalController.logout)
router.get('/examenes/pendientes',theoricalController.pendingExams)
router.post('/examenes/set-exam',theoricalController.setExam)
router.get('/examenes/rehacer',theoricalController.retakeExam)
router.get('/examenes/preguntas',theoricalController.exam)
router.get('/examenes/resultado',theoricalController.examResult)
router.get('/examenes/ver-respuestas',theoricalController.viewExamAnswers)

//// practical exams
//router.get('/examenes/practicos',practicalController.practical)
//router.get('/examenes/teoricos',practicalController.practical)
// router.get('/examenes/examen-practico',practicalController.completePractical)
// router.get('/examenes/examen-practico/:idStudentsExams',practicalController.studentPractical)
// router.post('/examenes/examen-practico/:idStudentsExams',practicalController.studentPracticalProcess)

module.exports = router



