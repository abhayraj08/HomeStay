const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema, reviewSchema } = require('../schema');


// Validating Listing Schema with the help of JOI (server side validation)
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body || {});
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



// Index Route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}))

// New Route (getting the form)
router.get('/new', (req, res) => {
    res.render('listings/new');
})

// New Route (sending the data to db)
router.post('/', validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
}))

// Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "No such listing exists");
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}))

// Update Route (getting the form)
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "No such listing exists");
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing })
}))

// Update Route (sending updated data to db)
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
}))

module.exports = router;
