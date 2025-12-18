// MVC (Model–View–Controller) is a software design pattern that divides
// an application into three interconnected components to separate concerns.

// Model → Database (MongoDB)
// View → Frontend templates
// Controller → Express logic

// Controller : A Controller handles the application logic.
// It receives requests from routes, processes data (via models), and sends responses (views or JSON).

// =====================================================================================================================


const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}

module.exports.createNewListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
}

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "No such listing exists");
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}

module.exports.renderUpdateForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "No such listing exists");
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}