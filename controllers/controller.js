var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var Photo = mongoose.model('Photo');
var Comment = mongoose.model('Comment');

// ----------User method-------------
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

// ---------Photo method--------------
var createPhoto = function (req, res) {
    var newPhoto = new Photo({
        "name": req.body.name,
        "description": req.body.description,
        "image": req.body.image,
        "author": {
            id: req.user._id,
            username: req.user.username
        }
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
            res.render('photos/index', {photos: photos, currentUser: req.user})
        } else {
            res.sendStatus(404);
        }
    });
}

var findOnePhoto = function(req, res){
    Photo.findById(req.params.id).populate('comments').exec(function(err, foundPhoto){
        if(!err){
            res.render('photos/show', {photo: foundPhoto})
        }else{
            res.sendStatus(404);
        }
    });
}

var updateOnePhoto = function(req, res){
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(!err){
            res.redirect('/photo/'+req.params.id);
        }else{
            res.redirect('/photo');
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

var findAllPhotosByUsername = function (req, res) {
    User.findOne({username: req.params.username}, function (err, foundUser) {
        Photo.find({'author.username': req.params.username}, function (err, foundPhoto) {
            if (!err) {
                res.render('profile/profile', {
                    currentUser: foundUser,
                    photos: foundPhoto
                });
            } else {
                res.send(404);
            }
        });
    });
}

// -------------Comment Method-----------
var createComment = function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(!err){
            Comment.create(req.body.comment, function(err, comment){
                if(!err){
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    photo.comments.push(comment);
                    photo.save();
                    req.flash('success', 'successfully added a comment');
                    res.redirect('/photo/' + photo._id);
                }else{
                    req.flash('error', 'something went wrong');
                    console.log(err);
                }
            }) 
        }else{
            console.log(err);
            res.redirect('/photo');
        }
    });
}

var updateComment = function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(!err){
            res.redirect('/photo/'+req.params.id);
        }else{
            redirect('back');
        }
    });
}

var deleteComment = function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/photo/" + req.params.id);
        }
    });
}


module.exports.createUser = createUser;
module.exports.createPhoto = createPhoto;
module.exports.findAllPhotos = findAllPhotos;
module.exports.findOnePhoto = findOnePhoto;
module.exports.updateOnePhoto = updateOnePhoto;
module.exports.deleteOnePhoto = deleteOnePhoto;
module.exports.findAllPhotosByUsername = findAllPhotosByUsername;
module.exports.createComment = createComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;
