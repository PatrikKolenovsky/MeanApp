var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var config = require('./config/db-config.json')
var connectionString = config.connectionString;
const mongoose = require('mongoose');
mongoose.connect(connectionString,{ useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

var indexRouter = require('./routes/index');
var productRouter = require('./routes/products');
var orderRouter = require('./routes/orders');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {message: error.message}
    })
});

module.exports = app;
