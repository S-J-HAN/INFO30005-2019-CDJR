var mongoose = require('mongoose');
var User = mongoose.model('User');
var Photo = mongoose.model('Photo');
var passport = require('passport');
var localStrategy = require('passport-local');
var flash = require('connect-flash');
var middleware = require('../middleware');

var createUser = function(req, res){
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        age: req.body.age,
        city: req.body.city
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash("success", "Welcome to Drawer " + user.username);
            res.redirect('/')
        });
    });
}

var createPhoto = function(req, res){
    var newPhoto = new Photo({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        // author: {
        //     id: req.user._id,
        //     username: req.user.username
        // }
    });
    photo.save(newPhoto, function(err, newPhoto){
        if(!err){
            res.send(newPhoto);
        }else{
            res.sendStatus(400);
        }
    });
}

var findAllPhotos = function(req, res){
    Photo.find(function(err, photos){
        if(!err){
            res.send(photos);
        }else{
            res.sendStatus(404);
        }
    });
}

module.exports.createUser = createUser;
module.exports.createPhoto = createPhoto;
module.exports.findAllPhotos = findAllPhotos;