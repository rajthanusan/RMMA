const express = require('express');
const { registerUser, loginUser, getAllUsers, updateUser, deleteUser ,registerManager, editManager, deleteManager, registerOperator ,editOperator ,deleteOperator ,googleLogin, forgotPassword ,resetPassword,verifyCode } = require('../controllers/authController');
const { checkRole } = require('../middleware/authMiddleware');  

const router = express.Router();

 
router.post('/register', registerUser);

router.post("/google-login", googleLogin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/verify-code", verifyCode);


router.post('/register-manager', registerManager);

router.put('/users/:id', editManager);

 
router.delete('/users/:id', deleteManager);

router.post('/register-operator', registerOperator);

router.put('/users/:id', editOperator);

 
router.delete('/users/:id', deleteOperator);

 
router.post('/login', loginUser);

 
router.get('/users', getAllUsers);

 
router.put('/users/:userId', updateUser);

 
router.delete('/users/:userId', deleteUser);

module.exports = router;
