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
router.get('/inscriptions',inscriptionsController.mainMenu)
router.post('/inscriptions/set-course-type',inscriptionsController.setCourseType)
router.get('/inscriptions/hazardous-materials/sworn-declaration',hazardousMaterialsController.hmSwornDeclaration)
router.post('/inscriptions/hazardous-materials/set-sworn-declaration',hazardousMaterialsController.setSwornDeclaration)
router.get('/inscriptions/schedule',inscriptionsController.schedule)


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



