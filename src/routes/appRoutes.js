const express = require('express')
const mainController = require('../controllers/mainController.js')
const inscriptionsController = require('../controllers/inscriptions/inscriptionsController.js')
const hazardousMaterialsController = require('../controllers/inscriptions/hazardousMaterialsController.js')
const professionalLicencesController = require('../controllers/inscriptions/professionalLicencesController.js')

const profLicencesController = require('../controllers/professionalLicencesController.js')

const router = express.Router()

///// main
router.get('/main/login',mainController.login)
router.post('/main/login',mainController.loginProcess)
router.get('/main/main-menu',mainController.mainMenu)
router.post('/main/attendance',mainController.attendance)

///// inscriptions
router.get('/inscripciones',inscriptionsController.mainMenu)
router.post('/inscripciones/tipos-de-cursos',inscriptionsController.setCourseType)
router.get('/inscripciones/manejo-defensivo',inscriptionsController.selectCourse)
router.get('/inscripciones/mercancias-peligrosas',inscriptionsController.selectCourse)
router.get('/inscripciones/cursos',inscriptionsController.selectCourse)
router.post('/inscripciones/cursos',inscriptionsController.setCourse)


router.get('/inscripciones/licencias-profesionales',professionalLicencesController.types)
router.post('/inscripciones/licencias-profesionales/tipos',professionalLicencesController.setTypes)
router.get('/inscripciones/licencias-profesionales/cursos',professionalLicencesController.courses)
//router.post('/inscripciones/licencias-profesionales/cursos',professionalLicencesController.setCourses)

router.get('/inscripciones/cargas-peligrosas/declaracion-jurada',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscripciones/cargas-peligrosas/declaracion-jurada',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscripciones/cronograma',inscriptionsController.schedule)
router.post('/inscripciones/cronograma',inscriptionsController.setSchedule)
router.get('/inscripciones/datos-personales',inscriptionsController.personalData)
router.post('/inscripciones/datos-personales',inscriptionsController.setPersonalData)
router.get('/inscripciones/confirmar-inscripcion',inscriptionsController.checkout)
router.post('/inscripciones/confirmar-inscripcion',inscriptionsController.saveInscription)



///// professional licences
router.get('/professional-licences/inscriptions',profLicencesController.mainMenu)
router.post('/professional-licences/set-type',profLicencesController.setType)
router.get('/professional-licences/categories',profLicencesController.categories)
router.post('/professional-licences/set-categories',profLicencesController.setCategories)
router.get('/professional-licences/classes',profLicencesController.classes)
router.post('/professional-licences/set-schedule',profLicencesController.setSchedule)
router.get('/professional-licences/personal-data',profLicencesController.personalData)
router.post('/professional-licences/set-personal-data',profLicencesController.setPersonalData)
router.get('/professional-licences/checkout',profLicencesController.checkout)
router.post('/professional-licences/save-inscription',profLicencesController.saveInscription)




module.exports = router



