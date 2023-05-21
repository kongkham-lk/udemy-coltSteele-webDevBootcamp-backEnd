// ONE TO FEW
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
    first: String,
    last: String,
    addresses: [{
        // embed schema -> has its own id
        // disable embed id -> "_id: false,"
        _id: false,
        street: String,
        city: String,
        state: String,
        country: {
            type: String,
            reqouired: true,
        },
    }]
})

const User = mongoose.model('User', userSchema);

// first created user info
const makeUser = async () => {
    // await User.deleteMany({});
    const u = new User({
        first: "John",
        last: 'Potter',
    })
    u.addresses.push({
        street: '456 Sesame St.',
        city: 'Newyork',
        state: 'NY',
        country: 'USA'
    })
    const res = await u.save();
    console.log(res);
}
//call function
// makeUser();

// function adding address of that user id
const addAddress = async (id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: '99 3rd St.',
        city: 'Newyork',
        state: 'NY',
        country: 'USA'
    })
    const res = await user.save();
    console.log(res);
}
// call addAddress function
// addAddress('646712c5df7e7e2e8f4b87fc');