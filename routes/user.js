const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');


router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to HomeStay!");
            res.redirect('/listings');
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login', 
        failureFlash: true
    }), 
    async (req, res) => {
        req.flash("success", "Welcome back to HomeStay!");
        res.redirect('/listings');
    }
)

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        } 
        req.flash("success", "You are logged out!!");
        res.redirect('/listings');
    })
})

module.exports = router;
