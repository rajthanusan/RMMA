const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/reviews', reviewController.addReview);  
router.get('/reviews', reviewController.getAllReviews);  
router.put('/reviews/:id', reviewController.updateReview);  
router.delete('/reviews/:id', reviewController.deleteReview);  

module.exports = router;
