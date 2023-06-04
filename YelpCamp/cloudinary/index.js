const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// base on cloundinary doc => https://console.cloudinary.com/console/c-b64f4227c6091d523ddbcbef8ce8fa/getting-started
cloudinary.config({
    // the value has to match with key's name in .env file
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// setup an instance of cloundinary storage in this file => https://github.com/affanshahid/multer-storage-cloudinary
const storage = new CloudinaryStorage({
    // pass-in cloudinary object that has jus ocnfigured => cloudinary.configu(...) 
    cloudinary: cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});

module.exports = { cloudinary, storage };