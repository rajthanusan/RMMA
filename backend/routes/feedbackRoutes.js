 
const express = require('express');
const { submitFeedback, getAllFeedback, deleteFeedback ,respondToFeedback } = require('../controllers/feedbackController');

const router = express.Router();

 
router.post('/submit', submitFeedback);

 
router.get('/', getAllFeedback);

 
router.delete('/:id', deleteFeedback);

router.post('/respond', respondToFeedback);

module.exports = router;
