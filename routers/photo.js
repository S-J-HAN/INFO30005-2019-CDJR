var express = require('express');
var router = express.Router();
var Photo = require('../models/photo.js');
var ChildPhoto = require('../models/childphoto.js');
var User = require('../models/user.js');
var controller = require('../controllers/controller.js');
var middleware = require('../middleware');
var flash = require('connect-flash');
var multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

//get all photos
router.get('/', controller.findAllPhotos);

//generate create form
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('photos/new');
})

//CREATE new photos - create route
router.post('/', middleware.isLoggedIn, upload.array('imagefile', 20), controller.createPhoto);

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
router.post('/:id/like', middleware.isLoggedIn, controller.addToLike);

//remove from favorite
router.put('/:id/unlike', middleware.isLoggedIn, controller.removeFromLike);

module.exports = router;
