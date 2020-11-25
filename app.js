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

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorHandler.render404Page);

mongoose
    .connect('mongodb+srv://bkhactri:buikhacTri123@cluster0.gvlcx.mongodb.net/coza-db?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
        console.log('Connected to Database');
    })
    .catch(err => console.log(err));