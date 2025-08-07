const express = require('express')
const getPlController = require('../../controllers/apisControllers/getPlController')

const router = express.Router()

// types
router.get('/professional-licences/types',getPlController.types)

// categories
router.get('/professional-licences/categories',getPlController.categories)

// types_categories_prices
router.get('/professional-licences/types-categories-prices',getPlController.typesCategoriesPrices)

// additional_per_category
router.get('/professional-licences/additional-per-category',getPlController.addionalPerCategory)

// students
router.get('/professional-licences/students',getPlController.students)


module.exports = router



