const mongoose = require('mongoose');

/* no need to connect mongoose here again since we will link back to index.js file */

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    }
})

const Product = mongoose.model('Product', productSchema);

// IN ORDER TO IMPORT THE MODEL ABOVE TO USE SOMEWHERE ELSE
module.exports = Product;