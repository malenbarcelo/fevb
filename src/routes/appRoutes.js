const express = require('express')
const mainController = require('../controllers/mainController.js')

const professionalLicencesController = require('../controllers/professionalLicencesController.js')

const router = express.Router()

///// main
router.get('/main/login',mainController.login)
router.post('/main/login',mainController.loginProcess)
router.get('/main/main-menu',mainController.mainMenu)
router.post('/main/attendance',mainController.attendance)


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



