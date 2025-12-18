const express = require('express');
const router = express.Router({mergeParams: true});

const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const { newReview, deleteReview } = require('../controllers/review');


// New Route (sending the data to db)
router.post('/', isLoggedIn, validateReview, wrapAsync(newReview));

// Delete Route 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;
