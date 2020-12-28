const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const stripe = require('stripe')('sk_test_51HyteKG8oVt195nhn3Q8SwnvKDqhHiYIMzhzuw2GmMRthWC4si5JZ109hu3kdMnrfeo8NnHC426xtpT4toc59kQP00gY9tJQ5D');

const ITEMS_PER_PAGE = 10;

//render trang chu
exports.getIndex = async(req, res, next) => {
    let cartProds;
    if (req.user) {
        const cartFetch = await req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user => {
                if (user.cart == null) {
                    cartProds = { items: [], totalQty: 0, totalPrice: 0 };
                }
                cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
            })
            .catch(err => console.log(err));
    } else if (req.session.cart) {
        cartProds = req.session.cart
    } else {
        cartProds = { items: [], totalQty: 0, totalPrice: 0 };
    }
    let topView;
    let menProducts;
    let womenProducts;
    Product.find()
        .sort({ viewCount: -1 })
        .limit(3)
        .exec()
        .then(products => {
            topView = products;
            Product.find({ filter: { "$regex": "men", "$options": "i" } })
                .limit(2)
                .exec()
                .then(menProds => {
                    menProducts = menProds;
                    Product.find({ filter: { "$regex": "woman", "$options": "i" } })
                        .limit(2)
                        .exec()
                        .then(womenProds => {
                            womenProducts = womenProds;
                            Product.find()
                                .sort({ hasSold: -1 })
                                .limit(3)
                                .exec()
                                .then(bestSold => {
                                    res.render('shop/index', {
                                        pageTitle: 'Home',
                                        path: '/',
                                        topView: topView,
                                        menProds: menProducts,
                                        womenProds: womenProducts,
                                        cartProds: cartProds,
                                        bestSold: bestSold,
                                        user: req.user,
                                        isAuthenticated: req.isAuthenticated(),
                                        query: ''
                                    });
                                })
                        });
                });
        });
};

//render trang san pham
exports.getProducts = async(req, res, next) => {
    let cartProds;
    if (req.user) {
        const cartFetch = await req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user => {
                cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
            })
            .catch(err => console.log(err));
    } else if (req.session.cart) {
        cartProds = req.session.cart
    } else {
        cartProds = { items: [], totalQty: 0, totalPrice: 0 };
    }
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
                    cartProds: cartProds,
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
                    cartProds: cartProds,
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
exports.getProduct = async(req, res, next) => {
    let cartProds;
    if (req.user) {
        const cartFetch = await req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user => {
                cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
            })
            .catch(err => console.log(err));
    } else if (req.session.cart) {
        cartProds = req.session.cart
    } else {
        cartProds = { items: [], totalQty: 0, totalPrice: 0 };
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: product.name,
                path: '/products/productId',
                product: product,
                title: product.filter[0].toUpperCase() + product.filter.substring(1),
                user: req.user,
                cartProds: cartProds,
                isAuthenticated: req.isAuthenticated()
            });
            if (!product.viewCount) {
                product.viewCount = 0;
            }
            product.viewCount++;
            return product.save();
        })
        .catch(err => console.log(err));
};

//render trang gio hang
exports.getCart = async(req, res, next) => {
    let cartProds;
    if (req.user) {
        const cartFetch = await req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user => {
                const products = user.cart.items;
                cartProds = { items: user.cart.items, totalQty: req.user.cart.totalQty, totalPrice: req.user.cart.totalPrice };
                res.render('shop/shopping-cart', {
                    pageTitle: 'Shopping Cart',
                    path: '/cart',
                    products: products,
                    user: req.user,
                    cartProds: cartProds,
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
            cartProds: req.session.cart,
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
                success_url: req.protocol + '://' + req.get('host') + '/orders',
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

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render('shop/order', {
                pageTitle: 'My Orders',
                path: '/orders',
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                orders: orders
            });
        })
};

exports.postOrder = async(req, res, next) => {
    const city = req.body.calc_shipping_provinces;
    const district = req.body.calc_shipping_district;
    const address = req.body.address;
    const detail_address = req.body.address_detail;
    const note = req.body.notes;
    const shipping_address = address + ', ' + district + ', ' + city;
    const today = new Date();
    const create_moment =
        `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - T${today.getDay() + +1} ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
    let products;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.cart.items.map(i => {
                return { product: {...i.productId._doc }, quantity: i.quantity, size: i.size, color: i.color };
            });
            const order = new Order({
                products: products,
                user: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    userId: req.user
                },
                shipping: {
                    address: shipping_address,
                    detail_address: detail_address,
                    note: note
                },
                totalPrice: user.cart.totalPrice,
                createDate: create_moment
            });
            return order.save();
        })
        .then(result => {
            products.forEach(async p => {
                const update = await Product.findById(p.product._id)
                    .then(product => {
                        if (!product.hasSold) {
                            product.hasSold = 0;
                        }
                        product.hasSold++;
                        product.save();
                    });
            })
            return req.user.clearCart();
        })
        .catch(err => console.log(err));
};

exports.getOrderDetail = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            res.render('shop/order-detail', {
                pageTitle: `Detail #${orderId}`,
                path: '/orders/orderId',
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                order: order
            })
        })
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};