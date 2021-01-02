const express = require('express');
const { check } = require('express-validator');
const shopController = require('../controllers/shopController');
const router = express.Router();
const checkAuth = require('../middleware/protect-routes');


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.post('/products', shopController.postProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.put('/cart/:productId/:size/:color/:quantity', shopController.postCart);

router.put('/cart/:cartId/:productId/:quantity', shopController.changeQuantityCartItem);

router.delete('/cart/:cartId/:productId', shopController.deleteCartItem);

router.get('/checkout', checkAuth, shopController.getCheckOut);

router.get('/checkout/cancel', shopController.getCheckOut);

router.post('/create-order', checkAuth, shopController.postOrder);

router.get('/orders', checkAuth, shopController.getOrders);

router.get('/orders/:orderId', checkAuth, shopController.getOrderDetail);

module.exports = router;