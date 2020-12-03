const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', authController.getLogIn);

router.get('/register', authController.getRegister);

router.post('/login', authController.postLogIn);

router.post('/logout', authController.postLogOut);

router.post('/register', authController.postRegister);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

module.exports = router;