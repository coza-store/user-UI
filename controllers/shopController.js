const Product = require('../models/productModel');
const ITEMS_PER_PAGE = 2;

//render trang chu
exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numOfProducts => {
            totalItems = numOfProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);

        })
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Home',
                path: '/',
                products: products,
                user: req.user,
                isAuthenticated: req.session.isLoggedIn,
                currentPage: page,
                totaProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
};

//render trang san pham
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numOfProducts => {
            totalItems = numOfProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);

        })
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'All products',
                path: '/products',
                products: products,
                user: req.user,
                isAuthenticated: req.session.isLoggedIn,
                currentPage: page,
                totaProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
};

//render trang chi tiet san pham
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: product.name,
                path: '/products/productId',
                product: product,
                title: product.filter[0].toUpperCase() + product.filter.substring(1),
                user: req.user,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err));
};

//render trang gio hang
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/shopping-cart', {
                pageTitle: 'Shopping Cart',
                path: '/cart',
                products: products,
                user: req.user,
                isAuthenticated: req.session.isLoggedIn
            })
        })
};

//them san pham vao gio hang
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    const size = req.body.size;
    const color = req.body.color;
    const qty = req.body.numProduct;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product, size, color, qty);
        })
        .then(result => {
            console.log('Add new product to cart');
            res.redirect('/cart');
        });
};

exports.postDeleteCartItem = (req, res, next) => {
    const cartItemId = req.body.cartItemId;
    req.user
        .deleteCartItem(cartItemId)
        .then(result => {
            console.log('Remove product from cart');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};