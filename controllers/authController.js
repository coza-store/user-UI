const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
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
            res.redirect('/login');
        })
        .catch(err => console.log(err))
};

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset password',
        path: '/reset'
    });
}

exports.postReset = (req, res, next) => {
    res.redirect('/login');
}