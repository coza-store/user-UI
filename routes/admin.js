const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/add-product => get
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => post
router.post('/add-product', adminController.postAddProduct);

module.exports = router;