const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const tripRouter = require('./routes/trip');
const userRouter = require('./routes/user');
const AppError = require('./utils/AppError');
const errorHandler = require('./utils/errorHandler');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cors({
    exposedHeaders: 'Authorization'
}));
app.use(express.json());

// ROUTES
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
})

app.use(errorHandler);

module.exports = app;
