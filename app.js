var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var passport = require('passport');
var flash = require('connect-flash');
require('dotenv').config();

var session = require("express-session"),
    bodyParser = require("body-parser");
var app = express();
mongoose.set('useCreateIndex', true)
mongoose.connect("mongodb://owner12:owner12@azure-shard-00-00-r6jcj.azure.mongodb.net:27017,azure-shard-00-01-r6jcj.azure.mongodb.net:27017,azure-shard-00-02-r6jcj.azure.mongodb.net:27017/test?ssl=true&replicaSet=Azure-shard-0&authSource=admin&retryWrites=true", { useNewUrlParser: true }, (err) => {
    if (err) console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: false,
        secure: false,
        expires: false,

    },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;