const AppError = require('./../utils/appError');


const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			err: err,
			stack: err.stack
		});
	} else {
		res.status(err.statusCode).render('error', {
			title: 'something went wrong!.',
			msg: err.message
		})
	}
};
const sendErrorProd = (err, req, res) => {
	// For Api
	if (req.originalUrl.startsWith('/api')) {
		if (err.isOperational) {
			// operational ,trusted error: send message to client
			res.status(err.statusCode).json({
				status: err.status,
				message: err.message
			});
		} else {
			//programming or other unknown error : don't leak details
			//1) log error
			console.error('Eerror', err);
			//2)send response
			res.status(500).json({
				status: 'error',
				message: "something went very wrong"
			})

		}
	} else {
		//Rendering website
		if (err.isOperational) {
			// operational ,trusted error: send message to client
			res.status(err.statusCode).render('error', {
				title: 'something went wrong!.',
				msg: err.message
			})
		} else {
			//programming or other unknown error : don't leak details
			//1) log error
			console.error('Eerror', err);
			//2)send response
			res.status(err.statusCode).render('error', {
				title: 'something went wrong!.',
				msg: 'please, Try again leter'
			})

		}
	}
};

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path} : ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
	// const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
	const value = Object.values(err.keyValue)[0];//modern way to find  the duplicated name
	const message = `Duplicate field value:${value}. please use another value!`;
	return new AppError(message, 400)
}
const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input data . ${errors.join(". ")}`;
	return new AppError(message, 400);
}
const handleJwtError = err => new AppError("Invalid token. please log in again!", 401);
const handleJwtExpiredError = err => new AppError("Expired token. please log in again!", 401);
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = Object.create(err);
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldDB(error);
		if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJwtError(error);
		if (error.name === "TokenExpiredError") error = handleJwtExpiredError(error)
		sendErrorProd(error, req, res);
	};
}