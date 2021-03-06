var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var userSchema = mongoose.Schema({
  slackUserId:{
    type: String,
    required: true
  },
  token:{
    type: Object,
  },
})


var userModel = mongoose.model('User', userSchema);

module.exports={
  User: userModel,
}
