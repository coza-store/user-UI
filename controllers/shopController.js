const Product = require('../models/product');

//render trang chu
exports.getIndex = (req, res, next) => {
    const products = Product.list();
    res.render('shop/index', {
        pageTitle: 'Home',
        path: '/',
        products: products
    })
};

//render trang san pham
exports.getProducts = (req, res, next) => {
    const products = Product.list();
    res.render('shop/product-list', {
        pageTitle: 'Product',
        path: '/products',
        products: products
    })
};

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

exports.getProduct = (req, res, next) => {
    res.render('shop/product-detail', {
        pageTitle: 'Product detail',
        path: '/product-detail'
    })
};