const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.editReivew = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
};


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    // REMOVE REVIEW REFERENCE from campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(campground)
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${campground._id}`)
};