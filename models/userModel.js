const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Product = require('../models/productModel');
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
            size: { type: String, require: true },
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

userSchema.methods.clearCart = function() {
    this.cart = { items: [], totalQty: 0, totalPrice: 0 };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);