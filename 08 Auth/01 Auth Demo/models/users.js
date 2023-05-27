const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'REQUIRED USERNAME']
    },
    password: {
        type: String,
        required: [true, 'PASSWORD REQUIRED']
    }
})

// use 'function' instead of arrow '=>'
userSchema.statics.findByUsernameAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    //return the whole user as need to use user_id to store in the session
    return isValid ? foundUser : false;
}

// need to pass next as next() in order to move on
userSchema.pre('save', async function (next) {
    // if the password is not modify the don hash
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;