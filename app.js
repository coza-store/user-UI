const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


const shopRoutes = require('./routes/shopRoutes');
const authRoutes = require('./routes/authRoutes');

const User = require('./models/userModel');
const errorHandler = require('./controllers/errorController');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    User.findById('5fc4e878db7796004055d26f')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorHandler.render404Page);


mongoose
    .connect('mongodb+srv://admin:admincoza@cluster0.cjf9m.mongodb.net/coza-db?retryWrites=true&w=majority')
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