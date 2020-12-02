const User = require('../models/userModel');
//render trang dang nhap
exports.getLogIn = (req, res, next) => {
    //console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    })
};

//xu ly an dang nhap
exports.postLogIn = (req, res, next) => {
    User.findById('5fc5dfbfcb3e370129bbf717')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.session.save((err) => {
                console.log(err);
                res.redirect('/')
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

//render trang dang ky
exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        pageTitle: 'Register',
        path: '/register',
        isAuthenticated: req.session.isLoggedIn
    })
};