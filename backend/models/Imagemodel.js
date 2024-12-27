const express = require('express');
const { upload } = require('../config/cloudinary');  
const imageController = require('../controllers/imageController');

const router = express.Router();


router.get('/', imageController.getImages);


router.post('/', upload.single('file'), imageController.addImage);


router.put('/:id', upload.single('file'), imageController.updateImage);


router.delete('/:id', imageController.deleteImage);

module.exports = router;
