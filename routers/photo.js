var express = require('express');
var router = express.Router();
var Photo = require('../models/photo.js');
var controller = require('../controllers/controller.js');
var middleware = require('../middleware');

//get all photos
router.get('/', controller.findAllPhotos);

//generate create form
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('photos/new');
})

//create new photos - create route
router.post('/', middleware.isLoggedIn, controller.createPhoto);

module.exports = router;