var express = require('express');
var router = express.Router();
//var Photo = require('../models/photo.js');
var controller = require('../controllers/controller.js');
//var middleware = require('../middleware');

//get all photos
router.get('/', controller.findAllPhotos);

//generate create form
router.get('/new', function(req, res){
    res.render('photos/new');
})

//create new photos - create route
router.post('/', controller.createPhoto);

//SHOW route - show more info about one photo
router.get('/:id', controller.findOnePhoto);

//DESTROY route - delete specific image
router.delete('/:id', controller.deleteOnePhoto);

module.exports = router;