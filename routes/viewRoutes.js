const express = require('express');
const router = express.Router();
const viewControllers = require('./../controllers/viewControllers');
const authControllers = require('../controllers/authControllers');
const bookingController = require('../controllers/bookingController');


router.get('/', bookingController.createBookingCheckout, authControllers.isLoggedin, viewControllers.getOverview);

router.get('/tour/:tourSlug', authControllers.isLoggedin, viewControllers.getTour)

router.get('/login', authControllers.isLoggedin, viewControllers.getLoginForm)

router.get('/signup', authControllers.isLoggedin, viewControllers.getSignupForm)

router.get('/me', authControllers.protect, viewControllers.getAccount)

router.get('/my-tours', authControllers.protect, viewControllers.getMyTour)

router.get('/my-reviews', authControllers.protect, viewControllers.getMyReviews)

router.get('/billing', authControllers.protect, viewControllers.getMybooking)

router.post('/submit-user-data', authControllers.protect, viewControllers.updateUserData)

module.exports = router;
