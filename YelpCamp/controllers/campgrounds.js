const Campground = require('../models/campground');
// require mapbox's geocoding service 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// require mapbox token => in order to use the service
const mapBoxToken = process.env.MAPBOX_TOKEN;
// enable geocoding service by passing the token
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    // const currentUser = req.user;
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createNewCampground = async (req, res, next) => {
    // .forwardGecode(...).send() => async fuction => require await 
    //  REMARKS ".send()" => NEED TO INCLUDE, to send the query after calling .forwardGecode(...)
    const geoData = await geocoder.forwardGeocode({
        // location specify
        query: req.body.location,
        // how many results?
        limit: 1,
    }).send();
    if (!geoData) {
        req.flash('error', 'Invalid location, Retry again!');
        res.redirect('/campgrounds/new');
    }
    // if (!req.body.campground) throw new expressError('Invalide Campground Data', 400);
    // since req.body return as a key-value pair object -> need to access its key as well -> e.g. req.body.campground
    const campground = new Campground(req.body);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully added a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showPage = async (req, res) => {
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
        // console.log(campground.images[0].url);
    } catch (e) {
        res.status(404);
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds');
        // throw new expressError('Product Not Found!!!', 404);
    }
    res.render('campgrounds/show.ejs', { campground })
};

module.exports.renderEditForm = async (req, res) => {
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
};

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    // only update text info => jus findAndUpdate not need to .save()
    //BUT push NEW IMAGE need to .save()
    const updateCampground = await Campground.findByIdAndUpdate(id, req.body)
    //since .map() return an array => we don want to override the whole array or push the whole array to images array field (images accepte array of object not array of arrray)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updateCampground.images.push(...imgs);
    await updateCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updateCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(updateCampground);
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${updateCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const removeCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
};