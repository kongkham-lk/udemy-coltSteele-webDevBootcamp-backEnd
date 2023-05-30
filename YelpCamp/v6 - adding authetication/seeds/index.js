// a self contain file that works only with mongoose and use modules

const mongoose = require('mongoose');
// "./models" -> locate in models folder
// since this file is under different folde -> seeds not models folder -> need to back 1 step -> "../"
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log("Databse Connected");
    })
    .catch(err => {
        console.log("Connection error:");
        console.log(err);
    });

// multiply by arr.length -> since it has no use to multiply the number that greater than array -> cannot access anyway
const sample = (array) => array[Math.floor(Math.random() * array.length)];   //=> return random element

const resetDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias quas provident ducimus. Ducimus nisi non temporibus dolores esse nesciunt quis sed vero tenetur minima doloremque labore blanditiis, sapiente repudiandae rem.',
            price,
            author: '64744e140718ace493706a16',
        })
        await camp.save();
    }
}

resetDB().then(() => {
    // close after finish running
    mongoose.connection.close();
})

