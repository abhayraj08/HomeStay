const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware')

const { index, 
    renderNewForm, createNewListing, 
    showListing, 
    renderUpdateForm, updateListing, 
    deleteListing } = require('../controllers/listing');


router.get('/', wrapAsync(index));

router.get('/new', isLoggedIn, renderNewForm);

router.post('/', isLoggedIn, validateListing, wrapAsync(createNewListing));

router.get('/:id', wrapAsync(showListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(renderUpdateForm));

router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
