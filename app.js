var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const hbs = require('hbs');
const passport = require('./auth/passport');
const { checkAuthentication } = require('./auth/auth');
const session = require("express-session");
const flash = require('connect-flash');

// router
const indexRouter = require('./components/dashboard');
const userRouter = require('./components/user');
const adminRouter = require('./components/ad');
const airportRouter = require('./components/airport');
const seatClassController = require('./components/seatClass');
const planeController = require('./components/plane');
const authRouter = require('./components/auth');
const profileRouter = require('./components/profile');
const flightRouter = require('./components/flight');
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

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10,
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Get user from req
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

// use routes
app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/users', checkAuthentication, userRouter);
app.use('/admins', checkAuthentication, adminRouter);
app.use('/airports', checkAuthentication, airportRouter);
app.use('/seat-classes', checkAuthentication, seatClassController);
app.use('/planes', checkAuthentication, planeController);
app.use('/profile', checkAuthentication, profileRouter);
app.use('/flights', checkAuthentication, flightRouter);

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