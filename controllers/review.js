const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.newReview = async (req, res) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    req.flash('success', 'New Review Created!');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${id}`);
}
