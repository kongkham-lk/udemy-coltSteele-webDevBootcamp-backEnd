const express = require('express');
// to able to access the pass in id from the main file
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/CatchAsync');
const { isLoggedIn, validateReview } = require('../utils/middleware');
const reviews = require('../controllers/reviews');

// adding review  
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.editReivew));

// remove review (remove 2 things) -> remove both reference of the review inside campground and remove the review itself

router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router;