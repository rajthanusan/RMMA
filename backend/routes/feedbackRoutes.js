const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/feedback', feedbackController.submitFeedback);
router.get('/feedback', feedbackController.getFeedback);
router.delete('/feedback/:id', feedbackController.deleteFeedback);
router.post('/feedback/respond', feedbackController.respondToFeedback);

module.exports = router;
