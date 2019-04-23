var express = require('express');
var router = express.Router({
    mergeParams: true
});
var Photo = require('../models/photo');
var User = require('../models/user');
var middleware = require('../middleware');
var controller = require('../controllers/controller');

router.get('/', function(req, res){
    console.log(req.query.photoId);
})


module.exports = router;