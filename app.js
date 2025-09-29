const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

// Database connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/HomeStay';
mongoose.connect(MONGO_URL)
    .then(() => console.log('Database is connected'))
    .catch((e) => console.log('Error', e))


// Setting ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true })); // To use req.body
app.use(methodOverride('_method')); // To use PUT & DELETE
app.use(express.static(path.join(__dirname, 'public')));


// Dummy Routes
app.get('/', (req, res) => {
    res.send(`Hello World!! <br> <a href="/listings">listings</a>`);
})

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}))

// New Route (getting the form)
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
})

// New Route (sending the data to db)
app.post('/listings', wrapAsync(async (req, res, next) => {
    if(!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}))

// Show Routes
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        throw new ExpressError(400, "No such data in listing");
    }
    res.render('listings/show', { listing });
}))

// Update Routes (getting the form)
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit', { listing })
}))

// Update Routes (sending updated data to db)
app.put('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

// Delete Routes 
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listingS');
}))





// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     res.send(sampleListing);
// })


// 404 handler (for any route not matched above)
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

// Global error-handling middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error', {message});
})

// Starting the Server
const port = 3000;
app.listen(port, (req, res) => {
    console.log(`Server is listening at port : ${port}`);
})