var express = require('express');
const router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local');
var User = require('../models/user');
var controller = require('../controllers/controller.js');

//homepage
router.get('/', function (req, res) {
    res.render('home');
})

//show register form
router.get('/register', function(req, res){
    res.render('register');
})

//create a new user
router.post('/register', controller.createUser);

//show login form
router.get('/login', function (req, res) {
    res.render('login');
});

//handling login logic
//middle check before handler
router.post('/login', passport.authenticate('local', {
    successRedirect: '/photo',
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res){
});

//logout
router.get('/logout', function(req, res){
    //handle with passport
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect('back');
})

module.exports = router;