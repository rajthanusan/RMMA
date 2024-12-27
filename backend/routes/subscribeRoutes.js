const express = require('express');
const router = express.Router();
const subscribeController = require('../controllers/subscribeController');

 
router.post('/subscribe', subscribeController.subscribe);

 
router.get('/subscriptions', subscribeController.getAllSubscriptions);

 
router.delete('/unsubscribe', subscribeController.unsubscribe);

 
router.post('/sendMessageToAll', subscribeController.sendMessageToAll);

module.exports = router;
