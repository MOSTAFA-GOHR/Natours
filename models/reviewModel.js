const mongoose = require('mongoose');
const Tour = require('./toursModel');

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: [true, 'Please, Review can not be empty!']
	},
	rating: {
		type: Number,
		required: [true, 'A review must be have a rating'],
		min: [1, 'rating must be above 1'],
		max: [5, 'rating must be below 5']
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	user:
	{
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Review must belong to a user']
	}
	,
	tour:
	{
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'Review must belong to a tour']
	}
	,

},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);


reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function () {
	this.populate({
		path: 'user',
		select: 'name photo'
	})
	// .populate({
	// 	path: 'tour',
	// 	select: 'name'
	// })
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId }
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' }
			}
		}
	]);

	// console.log(stats)

	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsAverage: stats[0].avgRating,
			ratingsQuantity: stats[0].nRating
		})
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsAverage: 4.5,
			ratingsQuantity: 0
		})
	}
}

reviewSchema.post('save', function () {
	//this ponts too current review
	this.constructor.calcAverageRatings(this.tour);
});
// Recalculate rating on findOneAndUpdate and findOneAndDelete (Mongoose 6+)
reviewSchema.post(/^findOneAnd/, async function (doc) {
	if (doc) {
		await doc.constructor.calcAverageRatings(doc.tour);
	}
});

// reviewSchema.pre(/^findOneAnd/, async function () {
// 	this.r = await Tour.findOne();
// })
// reviewSchema.post(/^findOneAnd/, async function () {
// 	await this.r.constructor(this.r.tour);
// })

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;