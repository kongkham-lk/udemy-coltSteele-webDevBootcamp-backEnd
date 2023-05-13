const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/productApp')
    .then(() => {
    console.log("CONNNECTION OPEN!!!");
    })
    .catch(err => {
    console.log("OH NO, ERROR!!!");
    console.log(err);
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true, 
        maxlength: 20
    },
    price: {
        type: Number,
        require: true,
        default: 0,
        min: 0,   //=> NO ERROR MESSAGE
        min: [0, 'Price must be positive']  //=> setup custom validation error message
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    },
    onSale: {
        type: Boolean,
        default: false
    }
}) 

productSchema.methods.toggleOnSale = function() {
    this.onSale = !this.onSale;
    return this.save();
}

const Product = mongoose.model('Product', productSchema);

// const tire = new Product({name: 'tire', price: 5.99});
// tire.save();

const findProduct = async function (productName) {
    const foundProduct = await Product.findOne({ name: `${productName}` });
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
}

findProduct('tire');