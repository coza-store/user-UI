const express = require('express');
const router = express();
const Comment = require('../models/commentModel');
const Pusher = require('pusher');
const pusher = new Pusher({
    appId: '1131784',
    key: 'a050f5822d5da15b38a1',
    secret: 'c9cd7423647d740022a1',
    cluster: 'ap1',
    encrypted: true
});
router.post('/comment', async(req, res, next) => {
    console.log(req.body);
    if (req.body.rating == "" || req.body.rating == 0) {
        req.body.rating = 1;
    }
    const newComment = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        rating: req.body.rating,
        userImage: req.body.userImage
    }
    const comment = new Comment({
        productId: req.body.productId,
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        userImage: req.body.userImage,
        rating: req.body.rating,
        createTime: new Date()
    });
    const save_comment = await comment.save();
    pusher.trigger('real-time-comment', 'new_comment', newComment);
    res.json({ created: true });
});

module.exports = router;