// Validation for schema using joi (server side)

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title is required!"
        }),
        description: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().uri().allow("", null)
        }),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required().messages({
            "string.empty": "Comment is required!"
        })
    }).required()
})