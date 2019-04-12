var express = require('express');
var router = express.Router({
    mergeParams: true
});
var Photo = require('../models/photo');
var Comment = require('../models/comment');
var middleware = require('../middleware');
var controller = require('../controllers/controller');


//generate create comment form
router.get('/new', middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(!err){
            res.render('comments/new', {photo: photo});
        }else{
            console.log(err);
        }
    });
});

//create comment
router.post('/', middleware.isLoggedIn, controller.createComment);

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                photo_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (!err) {
            res.render("comments/edit", {
                photo_id: req.params.id,
                comment: foundComment
            });
        } else {
            res.redirect("back");
        }
    });
});

//Update comment
router.put('/:comment_id', middleware.checkCommentOwnership, controller.updateComment);

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, controller.deleteComment);

module.exports = router;