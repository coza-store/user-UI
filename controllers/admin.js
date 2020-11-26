const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

//1 method them product moi
exports.postAddProduct = (req, res, next) => {
    const name = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image_1 = req.body.imageUrl1;
    const image_2 = req.body.imageUrl2;
    const image_3 = req.body.imageUrl3;
    const filter = req.body.filter;
    const product = new Product({
        name: name,
        price: price,
        description: description,
        imageUrl: {
            detail_1: image_1,
            detail_2: image_2,
            detail_3: image_3
        },
        filter: filter,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            console.log('Created product');
        })
        .catch(err => {
            console.log(err);
        })
};