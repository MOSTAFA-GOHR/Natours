const express = require('express');
const authControllers = require('./../controllers/authControllers');
const reviewControllers = require('./../controllers/reviewController');


const router = express.Router({ mergeParams: true });

router.use(authControllers.protect);
router.route('/')
	.get(reviewControllers.getAllReviews)
	.post(authControllers.restrictTo('user'),
		reviewControllers.setTourUserIds, reviewControllers.createReview);

router.route('/my-reviews').get(reviewControllers.getMyReviews);

router.route('/:id')
	.get(reviewControllers.getReview)
	.patch(authControllers.restrictTo('admin', 'user'), reviewControllers.updateReview)
	.delete(authControllers.restrictTo('admin', 'user'), reviewControllers.deleteReview)

module.exports = router;