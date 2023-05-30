const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

const catchAsync = require('../utils/CatchAsync');

const { isLoggedIn, validateInput, isAuthor } = require('../utils/middleware');


// ROUTE to display all dataset
router.get('/', catchAsync(async (req, res) => {
    const currentUser = req.user;
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, currentUser });
}))


// ROUTE FOR CREATE
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


router.post('/', isLoggedIn, validateInput, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new expressError('Invalide Campground Data', 400);
    // since req.body return as a key-value pair object -> need to access its key as well -> e.g. req.body.campground
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// ROUTE FOR SHOW - detail of each campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground;
    try {
        campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        // enter the wrong ID != enter deleted ID
        if (!campground) {
            res.status(404);
            req.flash('error', 'The page has been deleted!')
            return res.redirect('/campgrounds');
        }
    } catch (e) {
        res.status(404);
        req.flash('error', 'Page Not found!')
        return res.redirect('/campgrounds');
        // throw new expressError('Product Not Found!!!', 404);
    }
    res.render('campgrounds/show.ejs', { campground })
}))

// ROUTE FOR UPDATE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground;
    try {
        campground = await Campground.findById(id).populate('reviews');
        if (!campground) {
            res.status(404);
            req.flash('error', 'The page has been deleted!')
            res.redirect('/campgrounds');
        }
    } catch (e) {
        res.status(404);
        req.flash('error', 'Page Not found!')
        res.redirect('/campgrounds');
        // throw new expressError('Product Not Found!!!', 404);
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateInput, catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateCampground = await Campground.findByIdAndUpdate(id, req.body)
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
}))

//ROUTE for delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const removeCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}))

module.exports = router;