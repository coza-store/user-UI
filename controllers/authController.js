const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const User = require('../models/userModel');
const passport = require('passport');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'adcoza123@gmail.com',
        pass: 'buikhacTri123'
    }
});


//render trang dang nhap
exports.getLogIn = (req, res, next) => {
    return res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login',
        errorMessage: '',
        oldInput: {
            email: '',
            password: ''
        },
        validationCond: []
    });
};

// xu ly an dang nhap
exports.postLogIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    passport.authenticate('local.signin', function(err, user, info) {
        if (info) {
            let message = info.message;
            if (message == 'User Not Found') {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: message,
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationCond: 'email'
                });
            }
            if (message == 'Incorrect Password') {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: message,
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationCond: 'password'
                });
            }
        }
        // req / res held in closure
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.user.updateCartSignIn(req.session.cart ? req.session.cart : { items: [] });
            req.session.cart = undefined;
            return req.session.save((err) => {
                console.log(err);
                res.redirect('/')
            });

        });

    })(req, res, next);
};

//xu ly an dang xuat
exports.postLogOut = (req, res, next) => {
    return req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
};

//render trang dang ky
exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        pageTitle: 'Register',
        path: '/register',
        errorMessage: '',
        oldInput: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationCond: []
    })
};

//xu ly an dang ky
exports.postRegister = (req, res, next) => {
    const errors = validationResult(req); //nhan error tra ve
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            pageTitle: 'Register',
            path: '/register',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            },
            validationCond: errors.array()[0]
        });
    } else {
        passport.authenticate('local.signup', function(err, user, info) {
            res.cookie('name', user.name);
            console.log('Created new user');
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    console.log(err);
                }
                const token = buffer.toString('hex');
                User.findOne({ email: req.body.email })
                    .then(user => {
                        user.token = token;
                        user.tokenExpiredTime = Date.now() + 3600000;
                        return user.save();
                    })
                    .then(result => {
                        const msg = {
                            from: 'Coza Store Authentication',
                            to: user.email,
                            subject: 'Verify account COZA STORE',
                            html: `
                            <h4>Verify your email to finish signing up for Coza Store</h4>
                            <p style="margin-top: 30px;">Thanks yor for choosing Coza.
                            <br>Please confirm that ${user.email} is your email address by clicking on the button below
                            <br>This link will expire after 1 hour</p>
                            <a style="background: #111;
                                height: 60px;
                                padding: 10px 43px;
                                border: 0;
                                color: #fff;
                                text-transform: capitalize;
                                cursor: pointer;
                                font-size: 16px;
                                border-radius: 0px;
                                margin-left: 100px;
                                text-decoration:none;" href="http://localhost:3000/verify/${token}">Verify now</a>
                            <p style="margin-top: 40px;">Thanks.<br>Admin Coza Store</p>`
                        };
                        return transporter
                            .sendMail(msg)
                            .catch(err => console.log(err));
                    })
                    .then(result => {
                        return res.render('auth/confirm-route', {
                            pageTitle: 'Verify email',
                            path: '/confirm-route',
                            user: req.cookies.name,
                            role: 'verify'
                        });
                    })
                    .catch(err => console.log(err));
            });
        })(req, res, next);
    }
};

//render trang nhap email lay lai mk
exports.getResetForm = (req, res, next) => {
    return res.render('auth/reset', {
        pageTitle: 'Reset password',
        path: '/reset',
        errorMessage: '',
    });
};

//xu ly gui mail de xac nhan lay lai mk
exports.postResetForm = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/reset', {
            pageTitle: 'Reset Password',
            path: '/reset',
            errorMessage: errors.array()[0].msg,
        });
    }
    let userInfo;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                userInfo = user
                if (!user) {
                    //flash later here
                    return res.redirect('/reset');
                }
                user.token = token;
                user.tokenExpiredTime = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                console.log('Submit email to reset password');
                const msg = {
                    from: 'Coza Store Authentication',
                    to: req.body.email,
                    subject: 'PASSWORD RESET',
                    html: `
                    <h4>Hi ${userInfo.name}</h4>
                    <p style="margin-bottom: 30px;">You recently request to reset your password for your Coza Store account.<br> Click the button below to reset it</p>
                    <a style="background: #111;
                        height: 60px;
                        padding: 10px 43px;
                        border: 0;
                        color: #fff;
                        text-transform: capitalize;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 0px;
                        margin-left: 100px;
                        text-decoration:none;" href="http://localhost:3000/reset/${token}">Reset your password</a>
                    <p style="margin-top:30px">If you did not request a password reset, please ignore this email.<br>This password reset is only valid for the next 1 hour</p>
                    <p style="margin-top: 40px;">Thanks.<br>Admin Coza Store</p>
                    `
                };
                return transporter
                    .sendMail(msg)
                    .catch(err => console.log(err));
            })
            .then(result => {
                return res.status(200).render('auth/confirm-route', {
                    pageTitle: 'Reset password',
                    path: '/confirm-route',
                    role: 'reset'
                });
            })
            .catch(err => console.log(err));
    })
};

//render trang doi mk
exports.getResetPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ token: token, tokenExpiredTime: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/reset-password', {
                pageTitle: 'New password',
                path: '/reset-password',
                userId: user._id.toString(),
                passwordToken: token,
                errorMessage: ''
            });
        })
        .catch(err => console.log(err));
};

//cap nhat mat khau moi
exports.postResetPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const pswdtoken = req.body.passwordToken;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/reset-password', {
            pageTitle: 'New password',
            path: '/reset/pswdtoken',
            userId: userId,
            passwordToken: pswdtoken,
            errorMessage: errors.array()[0].msg,
        });
    }
    let resetUser;
    User.findOne({
            token: pswdtoken, //ky tu ?
            tokenExpiredTime: { $gt: Date.now() }, //thoi gian cho ?
            _id: userId // user do co phai khong ?
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.token = undefined;
            resetUser.tokenExpiredTime = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));

};

//render trang thong bao nguoi dang nhap mail de xac nhan email
exports.getConfirmRoute = (req, res, next) => {
    return res.render('auth/confirm-route', {
        pageTitle: 'Verify Email',
        path: '/confirm-route',
        user: req.cookies.name
    });
};

//render trang xac nhan email
exports.getConfirmForm = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ token: token, tokenExpiredTime: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/confirm-email', {
                pageTitle: 'Verify Email',
                path: '/confirm-email',
                userId: user._id.toString(),
                verifyToken: token,
            });
        })
        .catch(err => console.log(err));
};

//xu ly xac nhan email nguoi dung
exports.postConfirm = (req, res, next) => {
    let userInfo;
    const userId = req.body.userId;
    const token = req.body.verifyToken;
    User.findOne({
            token: token, //ky tu ?
            tokenExpiredTime: { $gt: Date.now() }, //thoi gian cho ?
            _id: userId // user do co phai khong ?
        })
        .then(user => {
            userInfo = user;
            user.active = true;
            user.token = undefined;
            user.tokenExpiredTime = undefined;
            return user.save();
        })
        .then(result => {
            req.logIn(userInfo, function(err) {
                if (err) { return next(err); }
                return req.session.save((err) => {
                    console.log(err);
                    console.log('Email has been verified');
                    res.redirect('/')
                });
            });
        })
        .catch(err => console.log(err));
};

//render trang chinh sua thong tin nguoi dung
exports.getUserSetting = async(req, res, next) => {
    let cartProds;
    const cartFetch = await req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
            res.render('auth/user-setting', {
                pageTitle: 'Settings',
                path: '/setting',
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                cartProds: cartProds,
                errorMessage: '',
                errorMessage2: ''
            });
        })
        .catch(err => console.log(err));
};

//xu ly chinh sua thong tin nguoi dung
exports.postUserSetting = async(req, res, next) => {
    const image = req.file;
    const email = req.body.email;
    const fullname = req.body.name;
    const username = req.body.username;
    const phone = req.body.phone;
    let cartProds;
    const cartFetch = await req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
        });
    if (image) {
        req.user.userImage = image.path;
    }
    if (email != req.user.email) {
        req.user.email = email;
        req.user.active = false;
    }
    if (fullname) {
        req.user.name = fullname;
    }
    if (username) {
        req.user.username = username;
    }
    if (phone) {
        req.user.phone = phone;
    }
    return req.user.save()
        .then(result => {
            console.log('Update user setting');
            res.redirect('/setting');
        })
        .catch(err => console.log(err));
};

//xu ly doi mat khau trong tranng setting
exports.postResetSetting = async(req, res, next) => {
    let cartProds;
    const cartFetch = await req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
        });
    const currentPassword = req.body.currentPswd;
    const newPassword = req.body.newPswd;
    let errors = validationResult(req);;
    if (!req.user.validPassword(currentPassword)) {
        errors.array()[0].msg = 'Current Password is incorrect';
    }
    if (newPassword == currentPassword) {
        errors.array()[0].msg = 'New password must be different from current'
    }
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/user-setting', {
            pageTitle: 'Settings',
            path: '/setting',
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            cartProds: cartProds,
            errorMessage: '',
            errorMessage2: errors.array()[0].msg,
        });
    }
    bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
            req.user.password = hashedPassword;
            return req.user.save();
        })
        .then(result => {
            res.redirect('/setting');
        })
        .catch(err => console.log(err));
};

exports.getSettingVerify = async(req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.user.email })
            .then(user => {
                user.token = token;
                user.tokenExpiredTime = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                const msg = {
                    from: 'Coza Store Authentication',
                    to: req.user.email,
                    subject: 'Verify account COZA STORE',
                    html: `
                    <h4>Verify your email to finish signing up for Coza Store</h4>
                    <p style="margin-top: 30px;">Thanks yor for choosing Coza.
                    <br>Please confirm that ${req.user.email} is your email address by clicking on the button below
                    <br>This link will expire after 1 hour</p>
                    <a style="background: #111;
                        height: 60px;
                        padding: 10px 43px;
                        border: 0;
                        color: #fff;
                        text-transform: capitalize;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 0px;
                        margin-left: 100px;
                        text-decoration:none;" href="http://localhost:3000/verify/${token}">Verify now</a>
                    <p style="margin-top: 40px;">Thanks.<br>Admin Coza Store</p>`
                };
                return transporter
                    .sendMail(msg)
                    .catch(err => console.log(err));
            })
            .then(result => {
                return res.render('auth/confirm-route', {
                    pageTitle: 'Verify email',
                    path: '/confirm-route',
                    user: req.user.name,
                    role: 'verify'
                });
            })
            .catch(err => console.log(err));
    });
};