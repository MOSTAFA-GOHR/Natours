const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');

exports.getAllReviews = factory.getAll(Review);
//  catchAsync(async (req, res, next) => {
// 	const reviews = await Review.find();



// 	res.status(200).json({
// 		status: 'success',
// 		results: reviews.length,
// 		data: {
// 			reviews
// 		}
// 	})
// });

exports.setTourUserIds = (req, res, next) => {
	//allow nested routes
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
	next();
}
exports.getMyReviews = catchAsync(async (req, res, next) => {
	const myReviews = await Review.find({ user: req.user.id });

	res.status(200).json({
		status: 'success',
		data: {
			result: myReviews.length,
			myReviews
		}
	})
})
exports.createReview = factory.createOne(Review);
// catchAsync(async (req, res, next) => {
// 	//allow nested routes
// 	if (!req.body.tour) req.body.tour = req.params.tourId;
// 	if (!req.body.user) req.body.user = req.user.id;

// 	const newReview = await Review.create(req.body);



// 	res.status(201).json({
// 		status: 'success',
// 		data: {
// 			review: newReview
// 		}
// 	})
// });
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.oneDelete(Review);
exports.updateReview = factory.updateOne(Review);