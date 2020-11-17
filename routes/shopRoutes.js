const express = require('express');
const shopController = require('../controllers/shopController');
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/login', shopController.getSignIn);

router.get('/register', shopController.getRegister);

router.get('/product-detail', shopController.getProduct);

module.exports = router;