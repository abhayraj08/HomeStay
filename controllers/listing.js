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
    // console.log(req.file)
    const url = req.file.path;
    const filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};      // adding cloudinary url and filename to listing 
    await newListing.save();                 // saving to mongo database
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

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");   // resizing the image to show in edit
    res.render('listings/edit', { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}