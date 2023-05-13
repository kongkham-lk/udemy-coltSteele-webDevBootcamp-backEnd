const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

const Campground = mongoose.model('Campground', CampgroundSchema);

// exportS has "S"
module.exports = Campground;