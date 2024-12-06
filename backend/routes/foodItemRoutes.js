const express = require('express');
const router = express.Router();
const multer = require('multer');
const foodItemController = require('../controllers/foodItemController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define routes
router.get('/food-items', foodItemController.getFoodItems);
router.post('/food-items', upload.single('image'), foodItemController.addFoodItem);

module.exports = router;
