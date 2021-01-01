const { capitalize, escapeRegex } = require('../models/service/module.js');
const queryString = require('query-string');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const stripe = require('stripe')('sk_test_51HyteKG8oVt195nhn3Q8SwnvKDqhHiYIMzhzuw2GmMRthWC4si5JZ109hu3kdMnrfeo8NnHC426xtpT4toc59kQP00gY9tJQ5D');

const ITEMS_PER_PAGE = 12;

//render trang chu
exports.getIndex = async(req, res, next) => {
    const topView = await Product.find().sort({ viewCount: -1 }).limit(10).exec();
    const menProducts = await Product.find({ filter: { "$regex": "men", "$options": "i" } }).limit(9).exec();
    const womenProducts = await Product.find({ filter: { "$regex": "woman", "$options": "i" } }).limit(8).exec();
    const bestSold = await Product.find().sort({ hasSold: -1 }).limit(10).exec();
    return res.render('shop/index', {
        pageTitle: 'Home',
        path: '/',
        topView: topView,
        menProds: menProducts,
        womenProds: womenProducts,
        bestSold: bestSold,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
    });

};

//render trang san pham
exports.getProducts = async(req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    let products;
    const nextQuery = {...req.query, page: page + 1 };
    const prevQuery = {...req.query, page: page - 1 };
    const currentQuery = {...req.query, page: page };
    const qC = queryString.stringify(currentQuery);
    const qN = queryString.stringify(nextQuery);
    const qP = queryString.stringify(prevQuery);

    //search
    let search = req.query.search ? req.query.search : "";
    const regexSearch = new RegExp(escapeRegex(search), 'gi');
    //color
    let color = req.query.color ? req.query.color : "";
    const regexColor = new RegExp(escapeRegex(search), 'gi');
    console.log(req.query.color);
    totalItems = await Product
        .find({
            $and: [
                { name: regexSearch },
                { $or: [{ color: regexColor }] },
            ]
        })
        .countDocuments();


    products = await Product
        .find({
            $and: [
                { name: regexSearch },
                { $or: [{ color: regexColor }] },
            ]
        })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

    return res.render('shop/product-list', {
        pageTitle: 'All products',
        path: '/products',
        products: products,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        totaProducts: totalItems,
        currentPage: page,
        currentPageQuery: qC,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        nextPageQuery: qN,
        prevPage: page - 1,
        prevPageQuery: qP
    });
};

//render trang chi tiet san pham
exports.getProduct = async(req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId)
    const relatedProducts = await Product.find({ $and: [{ filter: { "$regex": product.filter, "$options": "i" } }, { _id: { $ne: product._id } }] }).limit(10).exec();
    res.render('shop/product-detail', {
        pageTitle: product.name,
        path: '/products/productId',
        product: product,
        relatedProducts: relatedProducts,
        title: capitalize(product.filter),
        user: req.user,
        isAuthenticated: req.isAuthenticated()
    });
    if (!product.viewCount) {
        product.viewCount = 0;
    }
    product.viewCount++;
    return product.save();
};

//render trang gio hang
exports.getCart = async(req, res, next) => {
    if (req.user) {
        const cartFetch = await req.user.populate('cart.items.productId').execPopulate();
        const products = cartFetch.cart.items;
        return res.render('shop/shopping-cart', {
            pageTitle: 'Shopping Cart',
            path: '/cart',
            products: products,
            user: req.user,
            isAuthenticated: req.isAuthenticated()
        });

    } else {
        if (!req.session.cart) {
            req.session.cart = { items: [], totalQty: 0, totalPrice: 0 }
        }
        const productsInCart = req.session.cart;
        return res.render('shop/shopping-cart', {
            pageTitle: 'Shopping Cart',
            path: '/cart',
            products: productsInCart.items,
            user: req.user,
            isAuthenticated: req.isAuthenticated()
        });
    }
};

//them san pham vao gio hang
exports.postCart = async(req, res, next) => {
    const productId = req.params.productId;
    let size = req.params.size;
    if (size == 0) {
        size = "";
    }
    const color = req.params.color;
    const qty = req.params.quantity;
    const product = await Product.findById(productId)
    if (req.user) {
        const cart = new Cart(req.user.cart ? req.user.cart : { items: [] });
        cart.addToCart(product, size, color, qty);
        req.user.cart = cart;
        req.user.save();
        console.log('Add new product to cart');
        res.status(200).json({
            message: 'Success !',
            totalQty: req.user.cart.totalQty,
            productName: product.name
        });
    } else {
        const cart = new Cart(req.session.cart ? req.session.cart : { items: [] });
        cart.addToCart(product, size, color, qty);
        req.session.cart = cart;
        console.log('Add new product to cart');
        res.status(200).json({
            message: 'Success !',
            totalQty: req.session.cart.totalQty,
            productName: product.name
        });
    }
};

//xoa 1 sp khoi gio hang
exports.deleteCartItem = async(req, res, next) => {
    const cartItemId = req.params.cartId;
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (req.user) {
        const cart = new Cart(req.user.cart ? req.user.cart : { items: [] });
        cart.deleteCartItem(cartItemId, product);
        req.user.cart = cart;
        req.user.save();
        res.status(200).json({
            message: 'Success !',
            cartTotal: req.user.cart.totalPrice.toFixed(2),
            totalQty: req.user.cart.totalQty,
            productName: product.name
        });
    } else {
        const cart = new Cart(req.session.cart ? req.session.cart : { items: [] });
        cart.deleteCartItem(cartItemId, product);
        req.session.cart = cart;
        res.status(200).json({
            message: 'Success !',
            cartTotal: req.session.cart.totalPrice.toFixed(2),
            totalQty: req.session.cart.totalQty,
            productName: product.name
        });
    }
};

exports.changeQuantityCartItem = async(req, res, next) => {
    const cartItemId = req.params.cartId;
    const quantity = req.params.quantity;
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (req.user) {
        const cart = new Cart(req.user.cart ? req.user.cart : { items: [] });
        cart.changeQuantity(cartItemId, quantity, product);
        req.user.cart = cart;
        req.user.save();
        res.status(200).json({
            message: 'Success !',
            cartTotal: req.user.cart.totalPrice.toFixed(2),
            totalQty: req.user.cart.totalQty
        });
    } else {
        const cart = new Cart(req.session.cart ? req.session.cart : { items: [] });
        cart.changeQuantity(cartItemId, quantity, product);
        req.session.cart = cart;
        res.status(200).json({
            message: 'Success !',
            cartTotal: req.session.cart.totalPrice.toFixed(2),
            totalQty: req.session.cart.totalQty
        });
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
            });
        })
        .catch(err => console.log(err));
};

exports.getOrders = async(req, res, next) => {
    const orders = await Order.find({ "user.userId": req.user._id })
    return res.render('shop/order', {
        pageTitle: 'My Orders',
        path: '/orders',
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        orders: orders
    });

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

exports.getOrderDetail = async(req, res, next) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId)
    return res.render('shop/order-detail', {
        pageTitle: `Detail #${orderId}`,
        path: '/orders/orderId',
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        order: order
    });
}