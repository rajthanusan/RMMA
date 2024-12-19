const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { upload } = require('../config/cloudinary');

router.get('/events', eventController.getEvents);
router.post('/events', upload.single('image'), eventController.addEvent);
router.put('/events/:id', upload.single('image'), eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.patch('/events/:id/toggle-status', eventController.toggleEventStatus);

module.exports = router;

