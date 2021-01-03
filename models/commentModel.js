const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId }
    name: { type: String, required: true },
    email: { type: String, require: true },
    review: { type: String, required: false },
    rating: { type: Number, required: true },
});

module.exports = mongoose.model('Comment', commentSchema);