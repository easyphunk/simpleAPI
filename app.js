const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const tripRouter = require('./routes/trip');
const userRouter = require('./routes/user');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
