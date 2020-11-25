const Product = require('../models/product');

//render trang chu
exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Home',
                path: '/',
                products: products
            })
        })
};

//render trang san pham
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'Product',
                path: '/products',
                products: products
            })
        })
};

//render trang chi tiet san pham
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: product.name,
                path: '/products/prodId',
                product: product,
                title: product.filter[0].toUpperCase() + product.filter.substring(1)
            })
        })
        .catch(err => console.log(err));
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