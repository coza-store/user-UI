const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const stripe = require('stripe')('sk_test_51HyteKG8oVt195nhn3Q8SwnvKDqhHiYIMzhzuw2GmMRthWC4si5JZ109hu3kdMnrfeo8NnHC426xtpT4toc59kQP00gY9tJQ5D');

const ITEMS_PER_PAGE = 10;

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
                isAuthenticated: req.isAuthenticated(),
                currentPage: page,
                totaProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                query: ''
            })
        })
};

//render trang san pham
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    console.log(req.query);
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({ name: regex })
            .countDocuments()
            .then(numOfProducts => {
                totalItems = numOfProducts;
                return Product
                    .find({ name: regex })
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE);

            })
            .then(products => {
                res.render('shop/product-list', {
                    pageTitle: 'All products',
                    path: '/products',
                    products: products,
                    user: req.user,
                    isAuthenticated: req.isAuthenticated(),
                    currentPage: page,
                    totaProducts: totalItems,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    query: req.query.search
                })
            })
    } else {
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
                    isAuthenticated: req.isAuthenticated(),
                    currentPage: page,
                    totaProducts: totalItems,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    query: ''
                })
            })
    }
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
                isAuthenticated: req.isAuthenticated()
            })
        })
        .catch(err => console.log(err));
};

//render trang gio hang
exports.getCart = async(req, res, next) => {
    if (req.user) {
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
                    isAuthenticated: req.isAuthenticated()
                })
            });
    } else {
        if (!req.session.cart) {
            req.session.cart = { items: [] }
        }
        const productsInCart = req.session.cart;
        res.render('shop/shopping-cart', {
            pageTitle: 'Shopping Cart',
            path: '/cart',
            products: productsInCart.items,
            user: req.user,
            isAuthenticated: req.isAuthenticated()
        })
    }
};

//them san pham vao gio hang
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    const size = req.body.size;
    const color = req.body.color;
    const qty = req.body.numProduct;
    Product.findById(productId)
        .then(product => {
            if (req.user) {
                const cart = new Cart(req.user.cart ? req.user.cart : { items: [] });
                cart.addToCart(product, size, color, qty);
                req.user.cart = cart;
                return req.user.save();
            }
            const cart = new Cart(req.session.cart ? req.session.cart : { items: [] });
            cart.addToCart(product, size, color, qty);
            req.session.cart = cart;
        })
        .then(result => {
            console.log('Add new product to cart');
            res.redirect('/products');
        })
        .catch(err => console.log(err));
};

//xoa 1 sp khoi gio hang
exports.postDeleteCartItem = (req, res, next) => {
    const cartItemId = req.body.cartItemId;
    const productId = req.body.productId;
    if (req.user) {
        const cart = new Cart(req.user.cart ? req.user.cart : { items: [] });
        Product.findById(productId)
            .then(product => {
                req.user
                    .deleteCartItem(cartItemId, product)
                    .then(result => {
                        console.log('Remove product from cart');
                        res.redirect('/cart');
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    } else {
        const cart = new Cart(req.session.cart ? req.session.cart : { items: [] });
        cart.deleteCartItem(cartItemId);
        req.session.cart = cart;
        return res.redirect('/cart');
    }
};

//render trang thanh toan
exports.getCheckOut = (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.cart.items;
            total = 0;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            })

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.name,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    };
                }),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            });
        })
        .then(session => {
            res.render('shop/checkout', {
                pageTitle: 'Checkout',
                path: '/checkout',
                user: req.user,
                isAuthenticated: req.isAuthenticated(),
                products: products,
                totalOrder: total,
                sessionId: session.id
            })
        })
        .catch(err => console.log(err));
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};