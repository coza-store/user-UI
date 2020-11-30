const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', authController.getSignIn);

router.get('/register', authController.getRegister);

module.exports = router;