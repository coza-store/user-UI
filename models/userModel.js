const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiredTime: Date,
    cart: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            color: { type: String, required: true }
        }]
    },

});

userSchema.methods.addToCart = function(product, size, color, qty) {
    //tim index cua product can add xem co trong cart khong ?
    const cartProductIndex = this.cart.items.findIndex(p => {
        return p.productId.toString() === product._id.toString();
    });

    let newQuantity = qty;
    const updatedCartItems = [...this.cart.items];

    //product da co trong cart (cung size va color) nang quantity len
    if (cartProductIndex >= 0 &&
        this.cart.items[cartProductIndex].size == size &&
        this.cart.items[cartProductIndex].color == color) {
        newQuantity = this.cart.items[cartProductIndex].quantity + +qty;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        //product khong co trong cart tao them product moi
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
            size: size,
            color: color
        })
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteCartItem = function(cartItemId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item._id.toString() !== cartItemId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

module.exports = mongoose.model('User', userSchema);