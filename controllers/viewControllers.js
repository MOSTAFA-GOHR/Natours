const Tour = require('../models/toursModel');
const User = require('../models/usersModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get All Tours
  const tours = await Tour.find();
  //2) Build the template
  //3) render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) get the data,from the request tour (including reviews and guides)
  //2) build template
  //3)render template using the data from (1)

  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404))
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  })
})

exports.getLoginForm = (req, res) => {

  res.status(200).render('login', {
    title: 'Log into your account'
  })
}
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up'
  })
}

exports.getAccount = (req, res) => {

  res.status(200).render('account', {
    title: 'Your Account'
  })
}
exports.getMyReviews = async (req, res) => {
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name'
  });

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews
  })
}

exports.getMyTour = catchAsync(async (req, res, next) => {
  //1)find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //2) find tours with the returnd ids
  const toursIds = bookings.map(el => el.tour);

  const tours = await Tour.find({ _id: { $in: toursIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  })

})
exports.getMybooking = async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name'
  });

  res.status(200).render('billing', {
    title: 'Billing',
    bookings
  })
}

exports.updateUserData = catchAsync(async (req, res, next) => {

  const updateUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).render('account', {
    title: 'Your Account',
    user: updateUser
  })

})