const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.get('/my-bookings', bookingController.getMyBookings)

router.use(authController.restrictTo('admin', "lead-guide"));

router.get('/user-bookings', bookingController.getUserBookings);
router.get('/tour-bookings', bookingController.getTourBookings);


router.route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/:id').patch(bookingController.updateOneBooking)
  .get(bookingController.getOneBooking)
  .delete(bookingController.deleteOneBooking);


module.exports = router;