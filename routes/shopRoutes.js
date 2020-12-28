const express = require('express');
const { check } = require('express-validator');
const shopController = require('../controllers/shopController');
const router = express.Router();
const checkAuth = require('../middleware/protect-routes');


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postDeleteCartItem);

router.get('/checkout', checkAuth, shopController.getCheckOut);

router.get('/checkout/cancel', shopController.getCheckOut);

router.post('/create-order', checkAuth, shopController.postOrder);

router.get('/orders', checkAuth, shopController.getOrders);

router.get('/orders/:orderId', checkAuth, shopController.getOrderDetail);

module.exports = router;