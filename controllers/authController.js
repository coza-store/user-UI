const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'adcoza123@gmail.com',
        pass: 'buikhacTri123'
    }
})


//render trang dang nhap
exports.getLogIn = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login'
    })
};
//render trang dang ky
exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        pageTitle: 'Register',
        path: '/register'
    })
};

//xu ly an dang nhap
exports.postLogIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(equal => {
                    if (equal) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/')
                        })
                    }
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err));
};

//xu ly an dang xuat
exports.postLogOut = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
};

//xu ly an dang ky
exports.postRegister = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/register');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                });
        })
        .then(result => {
            console.log('Created new user');
            const msg = {
                from: 'Coza Store Authentication',
                to: email,
                subject: 'Sign up successfully',
                html: '<h1>You successfully signed up</h1>'
            };
            return transporter
                .sendMail(msg)
                .catch(err => console.log(err));
        })
        .then(result => {
            return res.redirect('/login');
        })
        .catch(err => console.log(err));
};

exports.getResetForm = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset password',
        path: '/reset'
    });
}

exports.postResetForm = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    //flash later here
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiredTime = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                console.log('Submit email to reset password');
                const msg = {
                    from: 'Coza Store Authentication',
                    to: req.body.email,
                    subject: 'Password reset',
                    html: `<p>You request to reset password</p>
                    <p>Follow this link to reset password: <a href="http://localhost:3000/reset/${token}">click me</a></p>
                    <p>This will be expired after 1 hours</p>
                    `
                };
                return transporter
                    .sendMail(msg)
                    .catch(err => console.log(err));
            })
            .then(result => {
                res.redirect('/login');
            })
            .catch(err => console.log(err));
    })
}

exports.getResetPassword = (req, res, next) => {
    const token = req.params.token;
    res.render('auth/reset-password', {
        pageTitle: 'New password',
        path: '/reset-password'
    });
}