const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware')

const { index,
    renderNewForm, createNewListing,
    showListing,
    renderUpdateForm, updateListing,
    deleteListing } = require('../controllers/listing');

    
router
    .route('/')
    .get(wrapAsync(index))
    .post(isLoggedIn, validateListing, wrapAsync(createNewListing))

router.get('/new', isLoggedIn, renderNewForm);

router
    .route('/:id')
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(renderUpdateForm));

module.exports = router;
