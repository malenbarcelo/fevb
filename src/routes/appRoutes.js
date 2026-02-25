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
router.get('/inscripciones/:branchAlias/tipos-de-cursos',inscriptionsController.coursesTypes)
router.post('/inscripciones/:branchAlias/tipos-de-cursos',inscriptionsController.setCourseType)
router.get('/inscripciones/:branchAlias/manejo-defensivo',inscriptionsController.selectCourse)
router.get('/inscripciones/:branchAlias/mercancias-peligrosas',inscriptionsController.selectCourse)
//router.get('/inscripciones/:branchAlias/seguridad-privada',inscriptionsController.selectCourse)
router.get('/inscripciones/:branchAlias/seguridad-privada',inscriptionsController.notAvailableCourse)
router.get('/inscripciones/:branchAlias/cursos',inscriptionsController.selectCourse)
router.post('/inscripciones/:branchAlias/cursos',inscriptionsController.setCourses)



router.get('/inscripciones/:branchAlias/licencias-profesionales',professionalLicencesController.types)
router.post('/inscripciones/:branchAlias/licencias-profesionales/tipos',professionalLicencesController.setTypes)
router.get('/inscripciones/:branchAlias/licencias-profesionales/cursos',professionalLicencesController.courses)
router.get('/inscripciones/:branchAlias/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscripciones/:branchAlias/mercancias-peligrosas/declaracion-jurada',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscripciones/:branchAlias/cronograma',inscriptionsController.schedule)
router.post('/inscripciones/:branchAlias/cronograma',inscriptionsController.setSchedule)
router.get('/inscripciones/:branchAlias/inscripcion-masiva/tipo-de-inscripcion',inscriptionsController.inscriptionType)
router.post('/inscripciones/:branchAlias/inscripcion-masiva/tipo-de-inscripcion',inscriptionsController.setInscriptionType)
router.get('/inscripciones/:branchAlias/datos-personales',inscriptionsController.personalData)
router.get('/inscripciones/:branchAlias/empresas/empresa',inscriptionsController.companyData)
router.post('/inscripciones/:branchAlias/empresas/empresa',inscriptionsController.setCompanyData)
router.get('/inscripciones/:branchAlias/empresas/datos-personales',inscriptionsController.personalDataCompanies)
router.post('/inscripciones/:branchAlias/datos-personales',inscriptionsController.setPersonalData)
router.get('/inscripciones/:branchAlias/confirmar-inscripcion',inscriptionsController.checkout)
router.post('/inscripciones/:branchAlias/confirmar-inscripcion',inscriptionsController.saveInscription)

///// redirections
router.get('/professional-licences/inscriptions',redirectController.plRedirect) // redirect old route
// router.get('/inscripciones/manejo-defensivo',redirectController.mdRedirect) // redirect old route
// router.get('/inscripciones/mercancias-peligrosas',redirectController.mpRedirect) // redirect old route
// router.get('/inscripciones/licencias-profesionales',redirectController.plRedirect) // redirect old route

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



