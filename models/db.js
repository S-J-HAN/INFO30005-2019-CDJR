var mongoose = require('mongoose');
mongoose.connect('mongodb://dongdong:password123@ds131676.mlab.com:31676/webproj', function(err){
    if(!err){
        console.log('connect to db!');
    }else{
        console.log('fail to connect db...');
    }
});

require('./user.js');
require('./photo.js');
require('./comment.js');