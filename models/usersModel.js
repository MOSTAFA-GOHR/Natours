const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please, tell us your name."],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Please, provide your email.'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email.']
	},
	photo: {
		type: String,
		default: 'default.jpg'
	},
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please, provide a password..'],
		trim: true,
		minlength: 8,
		select: false
	},
	passwordConfirm: {
		type: String,
		required: [true, 'A user must have a password.'],
		trim: true,
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords are not the same!!'
		}
	},
	passwordChangeAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false
	}
});

userSchema.pre('save', async function () {
	// only in update
	if (!this.isModified("password")) return;

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;

});

userSchema.pre('save', function () {
	if (!this.isModified('password') || this.isNew) return;

	this.passwordChangeAt = Date.now() - 1000;

})
userSchema.pre(/^find/, function () {
	//this points to the current query
	this.find({ active: { $ne: false } });
})
userSchema.methods.correctPassword = async function (condidatePassword, userPassword) {
	return await bcrypt.compare(condidatePassword, userPassword);
}

userSchema.methods.changesPasswordAfter = function (jwtTimeTamp) {
	if (this.passwordChangeAt) {
		const changedTimeTamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);

		return jwtTimeTamp < changedTimeTamp;
	}

	return false;
}

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;

}


const User = mongoose.model('User', userSchema);

module.exports = User;