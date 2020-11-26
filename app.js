const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const errorHandler = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shopRoutes');

const User = require('./models/user');

app.use((req, res, next) => {
    User.findById('5fbe80460ae79b017b2dc96f')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes); //Just for adding product will complete late in admin page

app.use(shopRoutes);

app.use(errorHandler.render404Page);


mongoose
    .connect('mongodb+srv://hhthuong:scbwwol123@cluster0.gvlcx.mongodb.net/coza-db?retryWrites=true&w=majority')
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Thuong',
                        email: 'hhthuonghcmus@gmail.com',
                        cart: {
                            item: []
                        }
                    });
                    user.save();
                }
            })
        app.listen(3000);
        console.log('Connected to Database');
    })
    .catch(err => console.log(err));