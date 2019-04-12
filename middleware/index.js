var middlewareObj = {};
var Photo = require('../models/photo');
var Comment = require('../models/comment');

middlewareObj.checkPhotoOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Photo.findById(req.params.id, function(err, foundPhoto){
            if(err){
                req.flash('error', 'Photo is not found');
                res.redirect('back')
            }else{
                if(foundPhoto.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error', "You don't have permission to do that.");
                    req.redirect('back');
                }
            }
        });
    }else{
        req.flash('error', 'You have to logged in to do that.');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            };
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;