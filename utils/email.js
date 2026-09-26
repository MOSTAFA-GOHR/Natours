const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email,
			this.firstName = user.name.split(' ')[0],
			this.url = url,
			this.from = `Mostafa Gohr <${process.env.EMAIL_FROM}>`
	}

	newCreateTransport() {
		if (process.env.NODE_ENV === 'production') {
			//sendgrid
			nodemailer.createTransport({
				service: "",
				auth: {
					user: '',
					pass: ""
				}
			})
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		})

	};

	async send(template, subject) {
		//send the actual email
		//1) Render HTML base on pug template
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				firstName: this.firstName,
				url: this.url,
				subject
			}
		);

		//2) Define a transport options and send email
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.convert(html)
		}

		//3) Create transport and email
		await this.newCreateTransport().sendMail(mailOptions)

	}

	async sendWellcom() {
		await this.send('welcome', 'Welcome to Natours Family!')
	}

	async sendResetPassword() {
		await this.send('passwordReset', 'your password reset token (valid for 10 min)')
	}
}




