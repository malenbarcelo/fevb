const express = require('express')
const mainController = require('../controllers/mainController.js')
const inscriptionsController = require('../controllers/inscriptions/inscriptionsController.js')
const hazardousMaterialsController = require('../controllers/inscriptions/hazardousMaterialsController.js')
const professionalLicencesController = require('../controllers/professionalLicencesController.js')

const router = express.Router()

///// main
router.get('/main/login',mainController.login)
router.post('/main/login',mainController.loginProcess)
router.get('/main/main-menu',mainController.mainMenu)
router.post('/main/attendance',mainController.attendance)

///// inscriptions
router.get('/inscripciones',inscriptionsController.mainMenu)
router.post('/inscripciones/tipos-de-cursos',inscriptionsController.setCourseType)
router.get('/inscripciones/cursos',inscriptionsController.selectCourse)
router.post('/inscripciones/cursos',inscriptionsController.setCourse)
router.get('/inscripciones/cargas-peligrosas/declaracion-jurada',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscripciones/cargas-peligrosas/declaracion-jurada',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscripciones/cronograma',inscriptionsController.schedule)
router.post('/inscripciones/cronograma',inscriptionsController.setSchedule)
router.get('/inscripciones/datos-personales',inscriptionsController.personalData)
router.post('/inscripciones/datos-personales',inscriptionsController.setPersonalData)
router.get('/inscripciones/confirmar-inscripcion',inscriptionsController.checkout)
router.post('/inscripciones/confirmar-inscripcion',inscriptionsController.saveInscription)



///// professional licences
router.get('/professional-licences/inscriptions',professionalLicencesController.mainMenu)
router.post('/professional-licences/set-type',professionalLicencesController.setType)
router.get('/professional-licences/categories',professionalLicencesController.categories)
router.post('/professional-licences/set-categories',professionalLicencesController.setCategories)
router.get('/professional-licences/classes',professionalLicencesController.classes)
router.post('/professional-licences/set-schedule',professionalLicencesController.setSchedule)
router.get('/professional-licences/personal-data',professionalLicencesController.personalData)
router.post('/professional-licences/set-personal-data',professionalLicencesController.setPersonalData)
router.get('/professional-licences/checkout',professionalLicencesController.checkout)
router.post('/professional-licences/save-inscription',professionalLicencesController.saveInscription)




module.exports = router



