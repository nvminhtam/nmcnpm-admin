var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const hbs = require('hbs');

// router
const indexRouter = require('./components/dashboard');
const userRouter = require('./components/user');
const adminRouter = require('./components/ad');
const airportRouter = require('./components/airport');
const seatClassController = require('./components/seatClass');
// helpers
const helpers = require('./hbsHelpers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials', (err) => {});

// load helpers
helpers.helpers(hbs);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use routes
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/airports', airportRouter);
app.use('/seat-classes', seatClassController);

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