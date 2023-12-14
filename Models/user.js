const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false }, // New field for admin status
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
