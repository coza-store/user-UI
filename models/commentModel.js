const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, require: true },
    comment: { type: String, required: false },
    userImage: { type: String, required: true },
    rating: { type: Number, required: true },
    purchaseConfirm: { type: Boolean, required: true },
    createTime: { type: Date, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);