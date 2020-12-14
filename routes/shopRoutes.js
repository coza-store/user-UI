const express = require('express');
const shopController = require('../controllers/shopController');
const router = express.Router();
const checkAuth = require('../middleware/protect-routes');


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', checkAuth, shopController.getCart);

router.post('/cart', checkAuth, shopController.postCart);

router.post('/cart-delete-item', checkAuth, shopController.postDeleteCartItem);

router.get('/checkout', checkAuth, shopController.getCheckOut);

router.post('/checkout', checkAuth, shopController.postCheckOut);



module.exports = router;