const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItemController');


router.get('/food-items', foodItemController.getFoodItems);


router.post('/food-items', foodItemController.addFoodItem);

module.exports = router;
