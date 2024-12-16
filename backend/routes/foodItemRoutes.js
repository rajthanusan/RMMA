const express = require('express');
const router = express.Router();
const multer = require('multer');
const foodItemController = require('../controllers/foodItemController');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.get('/food-items', foodItemController.getFoodItems); 
router.post('/food-items', upload.single('image'), foodItemController.addFoodItem); 
router.put('/food-items/:id', upload.single('image'), foodItemController.updateFoodItem); 
router.patch('/food-items/:id/toggle', foodItemController.toggleFoodItem);
router.delete('/food-items/:id', foodItemController.deleteFoodItem); 

module.exports = router;
