const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// username and password be will added through passport tool instead
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email Required'],
        // unique property for set up an index, NOT FOR VALIDATION
        unique: true,
    }
})

// this will add on to our schema a username and password fields => will make sure that username is unique and not duplicated
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;