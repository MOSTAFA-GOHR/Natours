const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/toursModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //2) create checkout session
  const session = await stripe.checkout.sessions.create({
    // session data
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&&user=${req.user.id}&&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    //product data information
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100
        },
        quantity: 1
      }
    ]

  });

  //3)create session response
  res.status(200).json({
    status: 'success',
    session
  });

});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // this is only temporary, becouse it's unsecure:everyone can make bookings without paying
  const { user, tour, price } = req.query;

  if (!user && !tour && !price) {
    return next()
  }

  await Booking.create({ user, tour, price });

  res.redirect(req.originalUrl.split('?')[0]);


});

exports.getMyBookings = catchAsync(async (req, res, next) => {

  const myBookings = await Booking.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name price imageCover startDates'
  });

  res.status(200).json({
    status: 'success',
    data: {
      results: myBookings.length,
      bookings: myBookings
    }
  })
})
exports.getUserBookings = catchAsync(async (req, res, next) => {

  const userBooking = await Booking.find({ tour: req.params.userId });

  res.status(200).json({
    status: 'success',
    data: {
      results: userBooking.length,
      bookings: userBooking
    }
  })
})
exports.getTourBookings = catchAsync(async (req, res, next) => {

  const tourBookings = await Booking.find({ tour: req.params.tourId });

  res.status(200).json({
    status: 'success',
    data: {
      results: tourBookings.length,
      bookings: tourBookings
    }
  })
})


exports.createBooking = factory.createOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.getOneBooking = factory.getOne(Booking);
exports.updateOneBooking = factory.updateOne(Booking);
exports.deleteOneBooking = factory.oneDelete(Booking);
