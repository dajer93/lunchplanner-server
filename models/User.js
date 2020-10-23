const crypto = require('crypto');
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  registered: {
    type: Date,
    required: true,
    default: Date.now()
  },
  emailIsVerified: {
    type: Boolean,
    default: false
  }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;