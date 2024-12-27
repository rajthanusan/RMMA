const express = require('express');
const { forgotPassword ,resetPassword,verifyCode } = require('../controllers/resetController');


const router = express.Router();

 




router.post("/forgot-password", forgotPassword);

router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);


module.exports = router;
