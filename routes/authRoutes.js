const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', authController.getLogIn);

router.post('/login', authController.postLogIn);

router.post('/logout', authController.postLogOut)

router.get('/register', authController.getRegister);

module.exports = router;