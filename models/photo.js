var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    likes: {
        type: Number,
        default: 0
    },
    postAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Photo', photoSchema);