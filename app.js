const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const tripRouter = require('./routes/trip');
const userRouter = require('./routes/user');
const AppError = require('./utils/AppError');
const errorHandler = require('./utils/errorHandler');

const app = express();

/* Global middleware */
// Set security HTTP headers
app.use(helmet());

// Logging when in dev env
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from the same IP to 100/hour
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later!'
});
app.use('/api', limiter);

// Body parser - limit incoming data size in req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSantize());

// Data sanitization against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['location', 'likes']
}));

/* Routes */
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
})

app.use(errorHandler);

module.exports = app;
