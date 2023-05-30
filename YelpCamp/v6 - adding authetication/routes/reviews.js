const express = require('express');
// to able to access the pass in id from the main file
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/CatchAsync');
const { isLoggedIn, isAuthor, validateReview } = require('../utils/middleware');


// adding review  
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

// remove review (remove 2 things) -> remove both reference of the review inside campground and remove the review itself

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    // REMOVE REVIEW REFERENCE from campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(campground)
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

module.exports = router;