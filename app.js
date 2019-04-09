var express = require('express');
var app = express();
var passport = require('passport');
var localStrategy = require('passport-local');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var User = require('./models/user');
var Photo = require('./models/photo');



app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(flash());

//set up database
require('./models/db.js');
var indexRoutes = require('./routers/index.js');
var photoRoutes = require('./routers/photo.js');

//passport config
app.use(require('express-session')({
    secret: "hello",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//methods come from passport-local-mongoose
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/photo', photoRoutes);

app.listen(process.env.PORT||3000, process.env.IP, function(req, res){
    console.log('server is runnning!!');
})