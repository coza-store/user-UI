const MONGODB_URL = 'mongodb+srv://admin:admincoza@cluster0.cjf9m.mongodb.net/coza-db';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
})
const app = express();

const shopRoutes = require('./routes/shopRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./controllers/errorController');

const User = require('./models/userModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'coza secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorHandler.render404Page);


mongoose
    .connect(MONGODB_URL)
    .then(result => {
        app.listen(process.env.PORT || 3000);
        console.log('Connected to Database');
    })
    .catch(err => console.log(err));