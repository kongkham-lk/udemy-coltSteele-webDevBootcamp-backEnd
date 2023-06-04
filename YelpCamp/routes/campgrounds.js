const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/CatchAsync');
const { isLoggedIn, validateInput, isAuthor } = require('../utils/middleware');
const campgounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });

router.route('/')
    .get(catchAsync(campgounds.index))
    .post(isLoggedIn, upload.array('image'), validateInput, catchAsync(campgounds.createNewCampground));

// ROUTE FOR CREATE
router.get('/new', isLoggedIn, campgounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgounds.showPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateInput, catchAsync(campgounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgounds.deleteCampground));

// ROUTE FOR UPDATE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgounds.renderEditForm));

module.exports = router;