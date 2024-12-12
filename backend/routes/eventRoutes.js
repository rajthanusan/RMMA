const express = require('express');
const router = express.Router();
const multer = require('multer');
const eventController = require('../controllers/eventController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/events', eventController.getEvents);
router.post('/events', upload.single('image'), eventController.addEvent);
router.put('/events/:id', upload.single('image'), eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;

