const express = require('express');
const router = express.Router({mergeParams: true});

const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { validateReview } = require('../middleware');

// New Route (sending the data to db)
router.post('/', validateReview, wrapAsync(async (req, res) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    req.flash('success', 'New Review Created!');
    res.redirect(`/listings/${id}`);
}));

// Delete Route 
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
