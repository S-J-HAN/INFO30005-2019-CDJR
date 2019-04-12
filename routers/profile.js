var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Photo = require('../models/photo');
var middleware = require('../middleware');

//user's profile page
router.get('/:username', middleware.isLoggedIn, function (req, res) {
    User.findOne({username: req.params.username}, function(err, foundUser){
        // if(!err){
        //     res.render('profile/profile', {currentUser: foundUser});
        // }else{
        //     res.sendStatus(404);
        // }
        Photo.find({
            'author.username': req.params.username
        }, function (err, foundPhoto) {
            if (!err) {
                res.render('profile/profile', {
                    currentUser: foundUser,
                    photos: foundPhoto
                });
            } else {
                res.send(404);
            }
        })
    })
});

router.get('/:username/work', middleware.isLoggedIn, function(req, res){
    Photo.find({'author.username': req.params.username}, function(err, foundPhoto){
        if(!err){
            res.send(foundPhoto);
        }else{
            res.send(404);
        }
    })
})

module.exports = router;