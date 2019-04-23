var express = require('express');
var router = express.Router();
var Photo = require('../models/photo.js');
var User = require('../models/user.js');
var controller = require('../controllers/controller.js');
var middleware = require('../middleware');
var flash = require('connect-flash');

//get all photos
router.get('/', controller.findAllPhotos);

//generate create form
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('photos/new');
})

//CREATE new photos - create route
router.post('/', middleware.isLoggedIn, controller.createPhoto);

//SHOW route - show more info about one photo
router.get('/:id', controller.findOnePhoto);

//generate update form
router.get('/:id/edit', middleware.checkPhotoOwnership, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
        res.render('photos/edit', {photo: foundPhoto});
    });
});

//UPDATE route - update one photo
router.put('/:id', middleware.checkPhotoOwnership, controller.updateOnePhoto);

//DESTROY route - delete specific image
router.delete('/:id', middleware.checkPhotoOwnership, controller.deleteOnePhoto);

// add to favorite
router.post('/:id/like', middleware.isLoggedIn, function(req, res) {
    Photo.findByIdAndUpdate({_id: req.params.id}, {$inc: {'likes': 1} }, function(err, photo){
        if(!err){
            photo.favorite.push(req.user._id);
            photo.save();
            req.flash('success', 'Successfully added to favorite!');
            res.redirect('back')
        }else{
            req.flash('error', 'something went wrong!');
            console.log(err);
        }
    })
})

//remove from favorite
router.put('/:id/unlike', middleware.isLoggedIn, function(req, res){
    Photo.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    favorite: req.user._id
                },
                $inc: {
                    'likes': -1
                }
            }
           , function (err, photo) {
                if(!err){
                    req.flash('success', 'Successfully removed from favorite!');
                    res.redirect('back');
                }else{
                    console.log(err);
                }
        })
})

module.exports = router;