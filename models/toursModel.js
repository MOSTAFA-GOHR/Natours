const mongoose = require("mongoose");
// const User = require('./usersModel')
const slugify = require("slugify");
const validator = require('validator');

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name!.'],
		unique: true,
		trim: true,
		maxlength: [40, 'A tour must have less or equal 40'],
		minlength: [10, 'A tour must have more than or equal 10']
	},
	summary: String,
	slug: String,
	secretTour: {
		type: Boolean,
		default: false
	},
	duration: {
		type: Number,
		required: [true, "A tour must have a duration."],
	},
	maxGroupSize: {
		type: Number,
		required: [true, "A tour Must have a group size."]
	},
	difficulty: {
		type: String,
		required: [true, "A tour Must have a difficulty."],
		enum: {
			values: ['easy', 'medium', 'difficult'],
			message: 'Difficulty is either : easy , medium or difficult.'
		}
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price!.'],
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
		min: [1, 'Rating must be above 1.0'],
		max: [5, 'Rating must be below 5.0'],
		set: val => Math.round(val * 10) / 10
	},
	ratingsQuantity: {
		type: Number,
		default: 0
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		required: [true, "A tour must have an image cover"]
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now
	},
	startDates: [Date],
	startLocation: {
		type: {
			type: String,
			default: 'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address: String,
		description: String
	},
	locations: [
		{
			type: {
				type: String,
				default: 'Point',
				enum: ['Point']
			},
			coordinates: [Number],
			address: String,
			description: String,
			day: Number
		}
	],
	guides: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});
//order data by index in mongoDB
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });



tourSchema.virtual('durationWeek').get(function () {
	return this.duration / 7;
});

tourSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'tour',
	localField: '_id'
})

// document middleware runs before save() create() and don't work with insertMany()
tourSchema.pre("save", function () {
	this.slug = slugify(this.name, { lower: true });
	//next make an error in res in postman ????
});
// embedding the guide in tour
// tourSchema.pre('save', async function () {
// 	const guidesPromise = this.guides.map(async id => await User.findById(id));
// 	this.guides = await Promise.all(guidesPromise);
// })
tourSchema.pre(/^find/, function () {
	this.populate({
		path: 'guides',
		select: '-__v -passwordChangeAt'
	})
})

tourSchema.post('save', function (doc, next) {
	console.log(doc);
	next()
})

tourSchema.pre(/^find/, function () {
	this.find({ secretTour: { $ne: true } });
});

// tourSchema.pre('aggregate', function () {
// 	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
// })
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;