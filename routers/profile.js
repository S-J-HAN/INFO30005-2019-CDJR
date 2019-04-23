var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Photo = require('../models/photo');
var middleware = require('../middleware');
var controller = require('../controllers/controller');

//user's profile page
router.get('/:username', middleware.isLoggedIn, controller.findAllPhotosByUsername);

//user's like work page
router.get('/:username/like', middleware.isLoggedIn, controller.findAllLikesByUsername);

module.exports = router;
