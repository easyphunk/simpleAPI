const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const tripRouter = require('./routes/trip');
const userRouter = require('./routes/user');
const AppError = require('./utils/AppError');
const errorHandler = require('./utils/errorHandler');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later!'
});
app.use('/api', limiter);

app.use(express.json());

app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
})

app.use(errorHandler);

module.exports = app;
