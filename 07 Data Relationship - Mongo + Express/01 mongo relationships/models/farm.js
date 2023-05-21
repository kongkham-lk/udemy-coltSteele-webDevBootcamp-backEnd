// ONE TO MANY
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/relationshipData')
    .then(() => {
        console.log("MONGO CONNNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO, CONNECTION ERROR!!!");
        console.log(err);
    })

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        Enum: ['Spring', 'Summer', 'Autumn', 'Winter'],
    }
})

const farmSchema = new mongoose.Schema({
    name: String,
    city: String,
    // link productId -> HAVE TO BE ARRAY
    //=> "type: mongoose.Schema.Types.ObjectId" -> OBJECTID
    //=> "ref: 'Product'" -> DEFINE COLLECTION's/MODEL's NAME to link here
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);

// // initial create product object
// Product.insertMany([
//     { name: 'Goddess Melon', Price: 4.99, season: 'Summer' },
//     { name: 'Sugar Melon', Price: 4.99, season: 'Summer' },
//     { name: 'Asparagus', Price: 3.99, season: 'Spring' },
// ])

// initial create farm object => NO PRODUCT ID INSERT YET
const makeFarm = async () => {
    const farm = new Farm({ name: 'Bare Bear Farm', city: 'Guind, CA' });
    const melon = await Product.findOne({ name: 'Goddess Melon' });
    // even this will pass in the whole melon object into farm's product array, only objectId will be stored
    farm.products.push(melon);
    // save to database
    await farm.save();
    console.log(farm);
}
// // call function
// makeFarm();

// INSERT PRODUCT ID
const addProduct = async () => {
    const farm = await Farm.findOne({ name: 'Full Green Farm' });
    const melon = await Product.findOne({ name: 'Asparagus' });
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
}
// // call function
// addProduct();

// display product detail when print
Farm.findOne({ name: 'Full Green Farm' })
    // pass in collection's name
    .populate('products')
    .then(farm => console.log(farm))