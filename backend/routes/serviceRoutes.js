const express = require('express');
const { upload } = require('../config/cloudinary');  // Use Cloudinary's upload method
const serviceController = require('../controllers/serviceController');

const router = express.Router();

router.post('/dishes', upload.single('image'), serviceController.createServiceCard);

router.get('/dishes', serviceController.getAllServices);

router.put('/dishes/:id', upload.single('image'), serviceController.updateServiceCard);

router.delete('/dishes/:id', serviceController.deleteServiceCard);

module.exports = router;
