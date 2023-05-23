const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
})

// to connect review model with campground model => update campground schema's structure by adding reviews field and review's objectID as value

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;