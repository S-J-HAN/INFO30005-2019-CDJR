var express = require('express');
var app = express();
var passport = require('passport');
var localStrategy = require('passport-local');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var User = require('./models/user');
var Photo = require('./models/photo');
var Comment = require('./models/comment');
var Moment = require('moment');
var firebase = require('firebase');

//Initialize Firebase.
var config = {
    apiKey: "AIzaSyDaOXY9ckdtA-WC-Pd6pGkLOw0RmbniGtE",
    authDomain: "zeta-verbena-238512.firebaseapp.com",
    databaseURL: "https://zeta-verbena-238512.firebaseio.com",
    projectId: "zeta-verbena-238512",
    storageBucket: "zeta-verbena-238512.appspot.com",
    messagingSenderId: "264680422704",
    appId: "1:264680422704:web:5a603c9ad12accbc"
  };
firebase.initializeApp(config);
var admin = require("firebase-admin");

var serviceAccount = require("./zeta-verbena-238512-firebase-adminsdk-efppm-fa368e2842.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zeta-verbena-238512.firebaseio.com"
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(methodOverride('_method'));

//set up database
require('./models/db.js');

var indexRoutes = require('./routers/index.js');
var photoRoutes = require('./routers/photo.js');
var commentRoutes = require('./routers/comment.js')
var profileRoutes = require('./routers/profile.js');

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
app.use('/photo/:id/comment', commentRoutes);
app.use('/profile', profileRoutes);

app.listen(process.env.PORT||3000, process.env.IP, function(req, res){
    console.log('server is runnning!!');
})
