var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var Photo = mongoose.model('Photo');
var ChildPhoto = mongoose.model('ChildPhoto');
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
    city: req.body.city,
    about: ''
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
var createPhoto = function(req, res) {
  var bucket = gcs.bucket('gs://zeta-verbena-238512.appspot.com');
  const gcsname = `${Date.now()}-${req.files[0].originalname}`;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype
    },
    resumable: false
  });
  stream.on('error', err => {
    console.log('hi');
    req.files[0].cloudStorageError = err;
  });

  stream.on('finish', () => {
    return file
      .makePublic()
      .then(() => {
        // const client = new vision.ImageAnnotatorClient();
        // const [result] = await client.labelDetection(`gs://${bucket.name}/${gcsame}`);
        // const labels = result.labelAnnotations;
        // var labelsFinal = []
        // for (var i=0; i<labels.length; i++) {
        //   if (labels[i].description.includes("paint")) {
        //     if (labels[i].accuracy > 0.8) {
        //       labelsFinal.push(labels[i].description)
        //     }
        //   } else {
        //     labelsFinal.push(labels[i].description)
        //   }
        // }

        var imgurl =
          'https://storage.googleapis.com/' + bucket.name + '/' + gcsname;

        var newPhoto = new Photo({
          name: req.body.name,
          description: req.body.description,
          image: imgurl,
          postAt: req.body.date,
          author: {
            id: req.user._id,
            username: req.user.username
          }
          // "labels": labelsFinal
        });
        newPhoto.save(function(err, newPhoto) {
          if (!err) {
            if (req.files.length == 1) {
              res.redirect('/photo');
            } else {
              createChildPhoto(req.files.slice(1), newPhoto._id, res);
            }
          } else {
            console.log(err);
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
  });
  stream.end(req.files[0].buffer);
};

var createChildPhoto = function(childfilelist, parentfileID, res) {
  var bucket = gcs.bucket('gs://zeta-verbena-238512.appspot.com');
  const gcsname = `${Date.now()}-${childfilelist[0].originalname}`;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: childfilelist[0].mimetype
    },
    resumable: false
  });
  stream.on('error', err => {
    childfilelist[0].cloudStorageError = err;
  });

  stream.on('finish', () => {
    return file.makePublic().then(() => {
      var imgurl =
        'https://storage.googleapis.com/' + bucket.name + '/' + gcsname;
      var newChildPhoto = new ChildPhoto({
        image: imgurl,
        parent: parentfileID
      });
      newChildPhoto.save(function(err, newChildPhoto) {
        if (!err) {
          if (childfilelist.length == 1) {
            res.redirect('/photo');
          } else {
            createChildPhoto(childfilelist.slice(1), parentfileID, res);
          }
        } else {
          res.sendStatus(400);
        }
      });
    });
  });

  stream.end(childfilelist[0].buffer);
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
  var getImage = function(item) {
    return item.image;
  };
  Photo.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPhoto) {
      if (!err) {
        ChildPhoto.find({ parent: req.params.id }).exec(function(
          err,
          foundSet
        ) {
          if (!err) {
            console.log(foundSet);
            console.log(foundSet.map(getImage));
            res.render('photos/show', {
              photo: foundPhoto,
              moment: moment,
              children: foundSet.map(getImage)
            });
          } else {
            res.sendStatus(404);
          }
        });
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
            user: foundUser,
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
