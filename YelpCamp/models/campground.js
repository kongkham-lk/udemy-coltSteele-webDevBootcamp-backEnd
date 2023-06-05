const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

//use mongoose method => .virtual()
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };


const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            // the type has to be string and POINT
            type: String,
            enum: ['Point'], //=> 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            // coordinates will be array of numbers
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
}, opts);

//add virtual property => since only require for displaying popup text on the cluster map feature
campgroundSchema.virtual('properties.popUpText').get(function () {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <br><i>${this.location}...</i>
        <br><span>${this.description.substring(0,55)}...</span>
    `;
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

// exportS has "S"
module.exports = Campground;