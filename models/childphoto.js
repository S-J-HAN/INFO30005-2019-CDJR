var mongoose = require('mongoose');

var childphotoSchema = new mongoose.Schema({
    image: String,
    parent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Photo' 
    }
});

module.exports = mongoose.model('ChildPhoto', childphotoSchema)
