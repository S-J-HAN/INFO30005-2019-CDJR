var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var Photo = mongoose.model('Photo');

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

var createPhoto = function (req, res) {
    var newPhoto = new Photo({
        "name": req.body.name,
        "description": req.body.description,
        "image": req.body.image
        // author: {
        //     id: req.user._id,
        //     username: req.user.username
        // }
    });
    newPhoto.save(function (err, newPhoto) {
        if (!err) {
            res.redirect('/photo')
        } else {
            res.sendStatus(400);
        }
    });
}

var findAllPhotos = function (req, res) {
    Photo.find(function (err, photos) {
        if (!err) {
            // res.send(photos);
            res.render('photos/index', {photos: photos})
        } else {
            res.sendStatus(404);
        }
    });
}

var findOnePhoto = function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(!err){
            res.render('photos/show', {photo: foundPhoto})
            // res.send(foundPhoto);
        }else{
            res.sendStatus(404);
        }
    });
}

var deleteOnePhoto = function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(!err){
            res.redirect('/photo');
        }else{
            res.redirect('/photo')
        }
    })
}

// var updatePhoto = function(req, res){
//     Photo.findByIdAndUpdate(req.params.id, req.body., )
// }

module.exports.createUser = createUser;
module.exports.createPhoto = createPhoto;
module.exports.findAllPhotos = findAllPhotos;
module.exports.findOnePhoto = findOnePhoto;
module.exports.deleteOnePhoto = deleteOnePhoto;