const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/authController');
const router = express.Router();

//dang nhap
router.get('/login', authController.getLogIn);

router.post('/login', authController.postLogIn);

//dang xuat
router.post('/logout', authController.postLogOut);

//dang ky
router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

//lay lai mat khau
router.get('/reset', authController.getResetForm);

router.post('/reset', authController.postResetForm);

//truy cap va cap nhat mat khau moi
router.get('/reset/:token', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;