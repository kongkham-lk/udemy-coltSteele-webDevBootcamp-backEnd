const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/personApp')
    .then(() => {
    console.log("CONNNECTION OPEN!!!");
    })
    .catch(err => {
    console.log("OH NO, ERROR!!!");
    console.log(err);
    });

const personSchema = new mongoose.Schema ({
    first: String,
    last: String
});

personSchema.virtual('fullName').get(function () {
    return `${this.first} ${this.last}`;
})
// .set(function(n) {
//     this.first = n.subStr(0, n.indexOf(' '));
//     this.last = n.subStr(n.indexOf(' ') + 1);
// })

const Person = mongoose.model('Person', personSchema);

// run in node shell
//const tammy = new Person({first: 'Tammy', last: 'Chow'});