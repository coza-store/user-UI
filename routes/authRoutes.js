const express = require('express');
const { check, body } = require('express-validator/check');
const User = require('../models/userModel');
const authController = require('../controllers/authController');
const router = express.Router();
const checkAuth = require('../middleware/protect-routes');


//dang nhap
router.get('/login', authController.getLogIn);

router.post('/login', authController.postLogIn);

//dang xuat
router.post('/logout', authController.postLogOut);

//dang ky
router.get('/register', authController.getRegister);

router.post('/register', [
        check('name').notEmpty().withMessage('Invalid name'),
        check('email').isEmail().custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already exist, please pick another one');
                    }
                });

        }),
        body('password', 'Password must have upper,lower,number and at least 8 charater').matches(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
        body('confirmPassword', '').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm password is not match');
            }
            return true;
        })
    ],
    authController.postRegister
);


//lay lai mat khau
router.get('/reset', authController.getResetForm);

router.post('/reset', body('email').isEmail().withMessage('Invalid email'), authController.postResetForm);

//truy cap va cap nhat mat khau moi
router.get('/reset/:token', authController.getResetPassword);

router.post('/reset-password',
    body('password', 'Password must have upper,lower,number and at least 8 charater').matches(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    body('confirmPassword', '').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm password is not match');
        }
        return true;
    }),
    authController.postResetPassword);

//xac nhan email dang ky
router.get('/confirm-route', authController.getConfirmRoute);

router.get('/verify/:token', authController.getConfirmForm);

router.post('/verify-email', authController.postConfirm);

//quan ly thong tin nguoi dung
router.get('/setting', checkAuth, authController.getUserSetting);

router.post('/setting', checkAuth, authController.postUserSetting);

router.post('/setting-password', checkAuth,
    body('newPswd', 'Password must have upper,lower,number and at least 8 charater').matches(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    body('confirmPswd', '').custom((value, { req }) => {
        if (value !== req.body.newPswd) {
            throw new Error('Confirm password is not match');
        }
        return true;
    }),
    authController.postResetSetting);

router.get('/setting-verify', checkAuth, authController.getSettingVerify);

module.exports = router;