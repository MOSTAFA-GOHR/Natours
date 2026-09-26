const crypto = require('crypto')
const { promisify } = require('util');

const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email')

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
}

const createSendToken = (user, stutasCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000),
		httpOnly: true
	}
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	//remove password form output 

	user.password = undefined;

	res.status(stutasCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	});
}
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		role: req.body.role,
		email: req.body.email,
		photo: req.body.photo,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm
	});

	const url = `${req.protocol}://${req.get('host')}/me`;

	await new Email(newUser, url).sendWellcom();

	createSendToken(newUser, 201, res);
});


exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	//1)check if email and password exist
	if (!email || !password) {
		return next(new AppError("please provide email and password", 400));
	};

	//2) check if user exist & password is correct
	const user = await User.findOne({ email: email }).select('+password');
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("incorrect email or password", 401));
	}




	//3) all is ok
	createSendToken(user, 200, res);

};

exports.logout = (req, res) => {
	res.cookie('jwt', 'logged out', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});

	res.status(200).json({ status: 'success' })
}

exports.protect = catchAsync(async (req, res, next) => {
	//1) getting token and check of it is there
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppError("you are not logged in, Please log in to get access.", 401));
	}

	//2) verification token

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	//3) check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('the user blonging to this token does no longer exist.', 401));
	};
	//4) check if user change password afer the token was issued
	if (currentUser.changesPasswordAfter(decoded.iat)) {
		return next(new AppError('User Recently Change password!. please log in again.', 401));
	}

	// grant access to protected route
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
})

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('you do not have permission to perform this action', 403));
		}
		next();
	}
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
	//1)Get user based on posted email
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError("there is no user with email address.", 404));
	};

	//2)generate the random reset token

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	//3)send it to user's email
	try {
		const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

		await new Email(user, resetURL).sendResetPassword();

		res.status(200).json({
			status: 'success',
			message: 'token sent to email'
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new AppError('there was an error sending the email!, try again  later.', 500));
	};


});

exports.resetPassword = catchAsync(async (req, res, next) => {
	//1) Get user based on the token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	const user = await User.findOne({
		passwordResetToken: hashedToken, passwordResetExpires: {
			$gt: Date.now()
		}
	});

	//2)if token has not expired, and there is user,set the new password
	if (!user) {
		return next(new AppError("Token is invalid or has expired.", 400));
	}
	// adding the new password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	// delete the resetToken
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	//1)Get user from collection
	const user = await User.findById(req.user.id).select('+password');

	//2) check if password current password is correct
	if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
		return next(new AppError('Your current password is wrong .', 401));
	};

	//3)if so, update password 
	// Update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	//send token
	createSendToken(user, 200, res);

})


exports.isLoggedin = async (req, res, next) => {
	try {
		if (req.cookies.jwt) {
			//1)verify token
			if (!req.cookies.jwt) {
				return next();
			}

			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

			//2) check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			};
			//3) check if user change password afer the token was issued
			if (currentUser.changesPasswordAfter(decoded.iat)) {
				return next();
			}

			// grant access to protected route
			res.locals.user = currentUser;
			return next()
		}
	} catch (error) {
		return next()
	}
	next()
}
