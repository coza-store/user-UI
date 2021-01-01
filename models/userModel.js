const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: false },
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, required: false },
    password: { type: String, require: true },
    userImage: { type: String, require: false },
    active: { type: Boolean, require: true },
    token: String,
    tokenExpiredTime: Date,
    cart: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
            quantity: { type: Number, require: true },
            size: { type: String, require: false },
            color: { type: String, require: true }
        }],
        totalQty: { type: Number, require: true },
        totalPrice: { type: Number, require: true }
    }
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.updateCartSignIn = async function(sessionCart) {
    try {
        const promise = sessionCart.items.map(item => {
            const cart = new Cart(this.cart ? this.cart : { items: [] });
            cart.addToCart(item.productId, item.size, item.color, item.quantity);
            this.cart = cart;
        });

        await Promise.all(promise);
        return this.save();
    } catch (error) {
        console.log(error.message);
    }

}

userSchema.methods.clearCart = function() {
    this.cart = { items: [], totalQty: 0, totalPrice: 0 };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);