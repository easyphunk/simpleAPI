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

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot find ${req.originalUrl} on this server!`
    })
})

module.exports = app;
