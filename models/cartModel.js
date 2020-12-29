const mongoose = require('mongoose');
class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || [];
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
    }

    addToCart(product, size, color, qty) {
        const cartProductIndex = this.items.findIndex(p => {
            return p.productId._id.toString() === product._id.toString();
        });

        let newQuantity = qty;
        const updatedCartItems = [...this.items];

        //product da co trong cart (cung size va color) nang quantity len
        if (cartProductIndex >= 0 &&
            this.items[cartProductIndex].size == size &&
            this.items[cartProductIndex].color == color &&
            this.items[cartProductIndex]._id) {
            newQuantity = +this.items[cartProductIndex].quantity + +qty;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            //product khong co trong cart tao them product moi
            updatedCartItems.push({
                _id: mongoose.Types.ObjectId(),
                productId: product,
                quantity: newQuantity,
                size: size,
                color: color
            });
        }
        this.totalQty += +qty;
        this.totalPrice += +(qty * product.price);
        this.items = updatedCartItems;
    }

    changeQuantity(cartItemId, quantity, product) {
        const cartItemIndex = this.items.findIndex(item => {
            return item._id.toString() === cartItemId.toString();
        });
        this.totalQty = this.totalQty - +(this.items[cartItemIndex].quantity);
        this.totalPrice = this.totalPrice - +(this.items[cartItemIndex].quantity * product.price);

        this.items[cartItemIndex].quantity = quantity;

        this.totalQty = this.totalQty + +(this.items[cartItemIndex].quantity);
        this.totalPrice = this.totalPrice + +(this.items[cartItemIndex].quantity * product.price);
    }

    deleteCartItem(cartItemId, product) {
        const cartItemIndex = this.items.findIndex(item => {
            return item._id.toString() === cartItemId.toString();
        });
        const updatedCartItems = this.items.filter(item => {
            return item._id.toString() !== cartItemId.toString();
        });
        this.totalQty = this.totalQty - +(this.items[cartItemIndex].quantity);
        this.totalPrice = this.totalPrice - +(this.items[cartItemIndex].quantity * product.price);
        this.items = updatedCartItems;
    }
}

module.exports = Cart;