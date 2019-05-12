var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    city: String,
    password: String,
    about: String,
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);