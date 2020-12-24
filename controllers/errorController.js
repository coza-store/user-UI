exports.render404Page = async(req, res, next) => {
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
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '',
        user: req.user,
        cartProds: cartProds,
        isAuthenticated: req.isAuthenticated()
    })
};