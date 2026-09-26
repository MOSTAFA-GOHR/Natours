const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//secoure
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
// const xss = require('xss');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
//routes
const toursRouter = require(`./routes/tourRoutes`);
const usersRouter = require(`./routes/userRoute`);
const reviewsRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
//parse the query
const qs = require('qs');
const compression = require('compression')


//parser the query data in http
app.set('query parser', str => qs.parse(str));



app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

//1)START GLOBAL MIDDLEWARE ///////////////////////
// for statical files in our folder
// app.use(express.static(`../starter/public`));
app.use(express.static(path.join(__dirname, 'public')));


//security http headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://js.stripe.com",
      ],

      connectSrc: [
        "'self'",
        "ws://127.0.0.1:1234",
      ],

      frameSrc: [
        "'self'",
        "https://js.stripe.com",
      ],
    },
  }));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // give data about request
};

//'limiting request' 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this ip, please try again in an hour!'
});

app.use('/api', limiter);


//'for body parser in request ==reading data  '
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser());

// sanitization aganst NO SQL query inejection
app.use(mongoSanitize());

//data sanitization against xss 
// app.use(xss());


//prevent parameters pollutions
app.use((req, res, next) => {
  const whitelist = [
    'duration',
    'ratingsAverage',
    'ratingsQuantity',
    'difficulty',
    'maxGroupSize',
    'price'
  ];

  for (const key in req.query) {
    if (Array.isArray(req.query[key]) && !whitelist.includes(key)) {
      return res.status(400).json({
        status: "fail",
        message: "there is mistake in the query"
      })
    }
  }


  next()
})


//testing middelware 
app.use((req, res, next) => {
  req.recivedAt = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use(compression());

//3)ROUTE REQUESTS////////////////////////////////////////

app.use('/', viewRouter)
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/booking', bookingRouter);


// 4) handling undefind routes

app.all('/{*any}', (req, res, next) => {
  // res.status(404).json({
  // 	status: 'fail',
  // 	message: `Can't find ${req.originalUrl} on this server!`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = "fail";
  // next(err)

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;