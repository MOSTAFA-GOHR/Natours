
const express = require('express');
const authController = require('./../controllers/authControllers');
const tourController = require('../controllers/tourController');
const reviewRouter = require('./../routes/reviewRoute')
const bookingRouter = require('./bookingRoutes');


const router = express.Router();


// route.param('id', tourController.checkID );

//for display the idea
//Post /tour/65f6sd56f5s6/reviews
//Get  /tour/65f6sd56f5s6/reviews/5456df5s5f

router.use('/:tourId/reviews', reviewRouter)
router.use('/:tourId/booking', bookingRouter)




router.route('/top-5-cheap')
	.get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);



router.route('/monthly-plan/:year').get(authController.protect,
	authController.restrictTo('admin', 'guide', 'lead-guide'), tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router.route('/')
	.get(tourController.getAllTours)
	.post(authController.protect, authController.restrictTo('admin', 'lead-guide'),
		tourController.createTour);
router.route('/:id')
	.get(tourController.getTour)
	.patch(authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.uploadTourImages,
		tourController.resizeTourImage,
		tourController.updateTour
	)
	.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),
		tourController.deleteTour);





module.exports = router;

