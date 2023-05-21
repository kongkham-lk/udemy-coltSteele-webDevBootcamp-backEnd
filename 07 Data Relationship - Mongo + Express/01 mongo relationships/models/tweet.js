// ONE TO MANY
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/relationshipData')
    .then(() => {
        console.log("MONGO CONNNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO, CONNECTION ERROR!!!");
        console.log(err);
    })

const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
})

const tweetSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

const makeTweet = async () => {
    const newUser = new User({ username: 'chicken95', age: '20' });
    const newTweet = new Tweet({ text: 'this chicken is so cute', likes: 20 });
    // INSERTING USERID TO TWEET
    newTweet.user = newUser;
    // save both to database
    newUser.save();
    newTweet.save();
}
// // call function
// makeTweet();

const addTweet = async () => {
    const user = await User.findOne({ username: 'chicken95' });
    const newTweet = new Tweet({ text: 'quak quak quak, my chicken mimic a duck', likes: 8 });
    // INSERTING USERID TO TWEET
    newTweet.user = newUser;
    // save both to database
    newTweet.save();
}
// // call function
// addTweet();

// display all user detail when print out tweet
const findTweet = async () => {
    const t = await Tweet.findOne({}).populate('user');
    console.log(t);
}
// //call function
// findTweet();