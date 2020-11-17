const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const errorHandler = require('./controllers/error');
const shopRoutes = require('./routes/shopRoutes');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(shopRoutes);

app.use(errorHandler.render404Page);
app.listen(3000);