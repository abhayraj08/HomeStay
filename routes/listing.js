const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware')


// Index Route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}))

// New Route (getting the form)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new');
})

// New Route (sending the data to db)
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
}))

// Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "No such listing exists");
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}))

// Update Route (getting the form)
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "No such listing exists");
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing })
}))

// Update Route (sending updated data to db)
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}))

module.exports = router;
