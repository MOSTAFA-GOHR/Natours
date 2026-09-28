# 🌍 Natours — Tour Booking Web Application

Natours is a full-stack tour booking web application built with **Node.js, Express, MongoDB, and Pug**.

The project was developed as a practical full-stack application to learn and implement authentication, authorization, RESTful APIs, database relationships, payments, reviews, email functionality, and server-side rendering.

## 🚀 Live Demo

🔗 **Live Demo:** Coming Soon

## 📂 GitHub Repository

🔗 https://github.com/MOSTAFA-GOHR/Natours

---

## ✨ Features

### 👤 Authentication & Authorization

* User signup and login
* Logout
* Password reset
* Update password
* Update user profile
* Profile photo upload
* JWT-based authentication
* HTTP-only cookies
* Role-based authorization
* User roles:

  * User
  * Guide
  * Lead Guide
  * Admin

### 🗺️ Tours

* Browse all available tours
* View tour details
* Tour difficulty
* Tour duration
* Tour price
* Tour locations
* Tour guides
* Tour ratings
* Tour images
* Tour map integration
* Tour filtering and sorting

### ⭐ Reviews

* Create reviews
* Update reviews
* Delete reviews
* View tour reviews
* View user's own reviews
* Rating system

### 💳 Booking & Payments

* Tour booking
* Stripe Checkout integration
* Secure payment flow
* Booking records
* View user's bookings
* Admin/lead-guide booking management

### 📧 Email

* Welcome emails
* Password reset emails
* Email notifications using Nodemailer
* Mailtrap integration for development

### 🔐 Security

The application includes several security-related middleware and techniques:

* Helmet
* Rate limiting
* MongoDB sanitization
* HTTP Parameter Pollution protection
* XSS protection
* Password hashing with bcrypt
* JWT authentication
* Secure cookies

---

## 🛠️ Technologies

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer
* Stripe

### Frontend

* Pug
* JavaScript
* Axios
* Parcel
* CSS

### APIs & Services

* MongoDB Atlas
* Stripe
* Mapbox
* Mailtrap

---

## 📁 Project Structure

```text
Natours/
│
├── controllers/
│   ├── authControllers.js
│   ├── bookingController.js
│   ├── reviewController.js
│   ├── tourController.js
│   └── userController.js
│
├── models/
│   ├── bookingModel.js
│   ├── reviewModel.js
│   ├── tourModel.js
│   └── userModel.js
│
├── routes/
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   ├── tourRoutes.js
│   └── userRoutes.js
│
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
│
├── views/
│   ├── base.pug
│   ├── overview.pug
│   ├── tour.pug
│   ├── login.pug
│   ├── account.pug
│   ├── myBookings.pug
│   └── myReviews.pug
│
├── public/
│   ├── css/
│   ├── img/
│   └── js/
│
├── app.js
├── server.js
├── config.env
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/MOSTAFA-GOHR/Natours.git
```

### 2. Enter the project directory

```bash
cd Natours
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `config.env` file in the project root.

Example:

```env
NODE_ENV=development
PORT=3000

DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE=mongodb+srv://your_username:<db_password>@cluster.mongodb.net/natours

JWT_SECRET=your_secret_key
JWT_EXPIRE_IN=90d
JWT_COOKIE_EXPIRE_IN=90

EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=your_email@example.com

STRIPE_SECRET_KEY=your_stripe_secret_key
MAPBOX_TOKEN=your_mapbox_token
```

> **Important:** Never commit your real `.env` or `config.env` secrets to GitHub.

---

## ▶️ Run the Application

### Development

```bash
npm start
```

The application will run on:

```text
http://localhost:3000
```

### Frontend JavaScript development

```bash
npm run watch:js
```

---

## 🔑 Environment Variables

The application requires the following environment variables:

| Variable               | Description               |
| ---------------------- | ------------------------- |
| `NODE_ENV`             | Application environment   |
| `PORT`                 | Server port               |
| `DATABASE_USERNAME`    | MongoDB username          |
| `DATABASE_PASSWORD`    | MongoDB password          |
| `DATABASE`             | MongoDB connection string |
| `JWT_SECRET`           | JWT secret key            |
| `JWT_EXPIRE_IN`        | JWT expiration            |
| `JWT_COOKIE_EXPIRE_IN` | Cookie expiration         |
| `EMAIL_HOST`           | SMTP host                 |
| `EMAIL_PORT`           | SMTP port                 |
| `EMAIL_USERNAME`       | SMTP username             |
| `EMAIL_PASSWORD`       | SMTP password             |
| `EMAIL_FROM`           | Sender email              |
| `STRIPE_SECRET_KEY`    | Stripe secret key         |
| `MAPBOX_TOKEN`         | Mapbox access token       |

---

## 🔌 API

The API uses the following base URL during development:

```text
http://localhost:3000/api/v1
```

### Tours

```text
GET    /tours
GET    /tours/:id
POST   /tours
PATCH  /tours/:id
DELETE /tours/:id
```

### Users

```text
POST   /users/signup
POST   /users/login
GET    /users/logout
GET    /users/me
PATCH  /users/updateMe
PATCH  /users/updateMyPassword
DELETE /users/deleteMe
```

### Reviews

```text
GET    /reviews
POST   /reviews
GET    /reviews/:id
PATCH  /reviews/:id
DELETE /reviews/:id
```

### Bookings

```text
GET    /booking/my-bookings
GET    /booking/checkout-session/:tourId
GET    /booking
POST   /booking
```

---

## 💳 Stripe

Stripe Checkout is used to process tour payments.

The application creates a Stripe Checkout Session when a user books a tour.

For production, make sure to use your production Stripe credentials and update the success/cancel URLs to your deployed application URL.

---

## 🗄️ Database

The application uses **MongoDB** with **Mongoose**.

MongoDB Atlas can be used as the production database.

The database contains relationships between:

```text
Users
  │
  ├── Reviews
  │
  └── Bookings
          │
          └── Tours
```

---

## 📧 Email

Nodemailer is used for sending emails.

During development, **Mailtrap** can be used to safely test emails without sending real messages.

---

## 🔐 Security

The application implements multiple security practices including:

* Password hashing
* JWT authentication
* HTTP-only cookies
* Helmet security headers
* Rate limiting
* MongoDB sanitization
* Input validation


---

## 🎯 Project Goals

This project was created to practice real-world backend and full-stack development concepts, including:

* RESTful API development
* MVC architecture
* Authentication and authorization
* MongoDB database design
* Mongoose relationships
* Middleware
* Error handling
* File uploads
* Email services
* Payment integration
* Server-side rendering
* API integration
* Application security
* Deployment

---

## 🚧 Future Improvements

Possible future improvements include:

* [ ] Add advanced tour search
* [ ] Improve booking management
* [ ] Add booking confirmation emails
* [ ] Add Stripe webhooks
* [ ] Improve mobile UI
* [ ] Add automated tests
* [ ] Add API documentation
* [ ] Deploy production version
* [ ] Add better error pages
* [ ] Add more admin dashboard features

---

## 👨‍💻 Author

**Mostafa Gohr**

Civil Engineer transitioning into Full-Stack Web Development.

### Skills

* JavaScript
* HTML5
* CSS3
* React
* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs
* Git & GitHub

---

## 📄 License

This project is for educational and portfolio purposes.
https://www.udemy.com/certificate/UC-51e7d93c-1fad-40b2-aaa8-693b8d739316/
