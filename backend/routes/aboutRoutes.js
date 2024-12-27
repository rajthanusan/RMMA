const express = require('express');
const { getAboutData, updateAboutData } = require('../controllers/aboutController');
const router = express.Router();


router.get('/about', getAboutData);


router.post('/about', updateAboutData);

module.exports = router;
