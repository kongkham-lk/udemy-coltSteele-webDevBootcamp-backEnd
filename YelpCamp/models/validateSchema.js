const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// prepare extension for Joi
// https://joi.dev/api/?v=17.9.1#validation-helpers 
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    // return error message when escapeHTML function found error
    messages: {
        'string.escapeHTML': '{{#label}} must be include HTML!'
    },
    // define all the rules for this extension
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    // specify option => type of symbol is allowed as input
                    allowTags: [],
                    allowAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// tell Joi to apply that extension
const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array(),
})

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
})