//render trang dang nhap
exports.getSignIn = (req, res, next) => {
    res.render('shop/login', {
        pageTitle: 'Sign in',
        path: '/signin'
    })
};

//render trang dang ky
exports.getRegister = (req, res, next) => {
    res.render('shop/register', {
        pageTitle: 'Register',
        path: '/register'
    })
};