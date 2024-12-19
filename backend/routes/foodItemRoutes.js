const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItemController');
const { upload } = require('../config/cloudinary');

router.get('/food-items', foodItemController.getFoodItems);
router.post('/food-items', upload.single('image'), foodItemController.addFoodItem);
router.put('/food-items/:id', upload.single('image'), foodItemController.updateFoodItem);
router.patch('/food-items/:id/toggle', foodItemController.toggleFoodItem);
router.delete('/food-items/:id', foodItemController.deleteFoodItem);

module.exports = router;

