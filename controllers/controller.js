var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var Photo = mongoose.model('Photo');
var Comment = mongoose.model('Comment');
var moment = require('moment');
var vision = require('@google-cloud/vision');
var multer = require('multer');
var config = {
  projectId: 'zeta-verbena-238512',
  keyFilename: './zeta-verbena-238512-firebase-adminsdk-efppm-fa368e2842.json'
};
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage(config);

// ----------User method-------------
var createUser = function(req, res) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    age: req.body.age,
    city: req.body.city
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      console.log('error', err.message);
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Hi ' + user.username + ', Welcome to Drawer!');
      res.redirect('/profile/' + user.username);
    });
  });
};

// ---------Photo method--------------
var createPhoto = async function(req, res) {
  const client = new vision.ImageAnnotatorClient();
  client
    .labelDetection(req.body.image)
    .then(results => {
      const labels = results[0].labelAnnotations;
      var labelsFinal = [];

      for (var i = 0; i < labels.length; i++) {
        if (labels[i].description.includes('paint')) {
          if (labels[i].accuracy > 0.8) {
            labelsFinal.push(labels[i].description.toLowerCase());
          }
        } else {
          labelsFinal.push(labels[i].description.toLowerCase());
        }
      }
      console.log(req.body);
      var newPhoto = new Photo({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        author: {
          id: req.user._id,
          username: req.user.username
        },
        postAt: req.body.date,
        labels: labelsFinal
      });
      newPhoto.save(function(err, newPhoto) {
        if (!err) {
          res.redirect('/photo');
        } else {
          res.sendStatus(400);
        }
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
      var newPhoto = new Photo({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        author: {
          id: req.user._id,
          username: req.user.username
        }
      });
      newPhoto.save(function(err, newPhoto) {
        if (!err) {
          res.redirect('/photo');
        } else {
          res.sendStatus(400);
        }
      });
    });
};

var setLabel = async function(req, res) {
  try {
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(req.body.image);
    const labels = result.labelAnnotations;

    Photo.findById(req.params.id, function(err, photo) {
      if (!err) {
        for (var i = 0; i < labels.length; i++) {
          if (
            (labels[i].description.includes('paint') &&
              labels[i].score > 0.8) ||
            !labels[i].description.includes('paint')
          ) {
            photo.labels.push(labels[i].description);
            console.log(labels[i].description);
          }
        }
      } else {
        console.log(err);
      }
    });
  } catch (err) {
    console.err(err);
  }
};

var findAllPhotos = function(req, res) {
  Photo.find(function(err, photos) {
    if (!err) {
      res.render('photos/index', { photos: photos, currentUser: req.user });
    } else {
      res.sendStatus(404);
    }
  });
};

var findOnePhoto = function(req, res) {
  Photo.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPhoto) {
      if (!err) {
        res.render('photos/show', { photo: foundPhoto, moment: moment });
      } else {
        res.sendStatus(404);
      }
    });
};

var updateOnePhoto = function(req, res) {
  Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(
    err,
    updatedPhoto
  ) {
    if (!err) {
      res.redirect('/photo/' + req.params.id);
    } else {
      res.redirect('/photo');
    }
  });
};

var deleteOnePhoto = function(req, res) {
  Photo.findByIdAndRemove(req.params.id, function(err) {
    if (!err) {
      res.redirect('/photo');
    } else {
      res.redirect('/photo');
    }
  });
};

//display user's previous work and sort by descending date (new -> old)
var findAllPhotosByUsername = function(req, res) {
  User.findOne({ username: req.params.username }, function(err, foundUser) {
    Photo.find({ 'author.username': req.params.username })
      .sort({ postAt: 'desc' })
      .exec(function(err, foundPhoto) {
        if (!err) {
          res.render('profile/profile', {
            currentUser: foundUser,
            photos: foundPhoto,
            moment: moment
          });
        } else {
          res.send(404);
        }
      });
  });
};

var findAllLikesByUsername = function(req, res) {
  User.findOne({ username: req.params.username }, function(err, foundUser) {
    Photo.find({ favorite: req.user._id }, function(err, foundPhoto) {
      if (!err) {
        res.render('profile/like', {
          currentUser: foundUser,
          photos: foundPhoto
        });
      } else {
        res.send(404);
      }
    });
  });
};

// -------------Comment Method-----------
var createComment = function(req, res) {
  Photo.findById(req.params.id, function(err, photo) {
    if (!err) {
      Comment.create(req.body.comment, function(err, comment) {
        if (!err) {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          photo.comments.push(comment);
          photo.save();
          req.flash('success', 'successfully added a comment');
          res.redirect('/photo/' + photo._id);
        } else {
          req.flash('error', 'something went wrong');
          console.log(err);
        }
      });
    } else {
      console.log(err);
      res.redirect('/photo');
    }
  });
};

var updateComment = function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    comment
  ) {
    if (!err) {
      res.redirect('/photo/' + req.params.id);
    } else {
      redirect('back');
    }
  });
};

var deleteComment = function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/photo/' + req.params.id);
    }
  });
};

// ---------------Like Method--------------
var addToLike = function(req, res) {
  Photo.findByIdAndUpdate(
    {
      _id: req.params.id
    },
    {
      $inc: {
        likes: 1
      }
    },
    function(err, photo) {
      if (!err) {
        photo.favorite.push(req.user._id);
        photo.save();
        req.flash('success', 'Successfully added to favorite!');
        res.redirect('back');
      } else {
        req.flash('error', 'something went wrong!');
        console.log(err);
      }
    }
  );
};

var removeFromLike = function(req, res) {
  Photo.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      $pull: {
        favorite: req.user._id
      },
      $inc: {
        likes: -1
      }
    },
    function(err, photo) {
      if (!err) {
        req.flash('success', 'Successfully removed from favorite!');
        res.redirect('back');
      } else {
        console.log(err);
      }
    }
  );
};

module.exports.createUser = createUser;
module.exports.createPhoto = createPhoto;
module.exports.setLabel = setLabel;
module.exports.findAllPhotos = findAllPhotos;
module.exports.findOnePhoto = findOnePhoto;
module.exports.updateOnePhoto = updateOnePhoto;
module.exports.deleteOnePhoto = deleteOnePhoto;
module.exports.findAllPhotosByUsername = findAllPhotosByUsername;
module.exports.createComment = createComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;
module.exports.addToLike = addToLike;
module.exports.removeFromLike = removeFromLike;
module.exports.findAllLikesByUsername = findAllLikesByUsername;
