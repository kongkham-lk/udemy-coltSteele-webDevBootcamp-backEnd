const Campground = require('../models/campground');
const Review = require('../models/review');
const expressError = require('../utils/expressError');
const { campgroundSchema, reviewSchema } = require('../models/validateSchema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // storing the FULL PATH for redirect
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Logged in required!')
        return res.redirect('/login');
    }
    next();
}

module.exports.validateInput = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new expressError(msg, 400);
    } else {
        // must include next() in order to pass to the next parameter within the same route handler
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(', ');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!req.user._id.equals(campground.author)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isRiviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!req.user._id.equals(review.author)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}