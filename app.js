if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Requiring Routes
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');

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

// session configuration
const sessionOptions = {
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}
app.use(session(sessionOptions));
app.use(flash());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());     

// strategy
passport.use(new LocalStrategy(User.authenticate()));

// serialize & deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});


// Dummy Route
app.get('/', (req, res) => {
    res.send(`Hello World!! <br> <a href="/listings">listings</a>`);
})

// Dummy Routes for password
// app.get('/demouser', async (req, res) => {
//     let testuser = new User ({
//         email: "spydii@gmail.com",
//         username: "spydii"
//     });

//     let registeredUser = await User.register(testuser, "helloworld");
//     res.send(registeredUser);
// })


// Listings Routes
app.use('/listings', listingRoutes);

// Reviews Routes
app.use('/listings/:id/reviews', reviewRoutes);

// User Routes
app.use('/', userRoutes);



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
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error', { message });
})

// Starting the Server
const port = 3000;
app.listen(port, (req, res) => {
    console.log(`Server is listening at port : ${port}`);
})