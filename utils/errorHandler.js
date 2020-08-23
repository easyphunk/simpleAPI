const AppError = require('./AppError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateEntryErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;

    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('\.')}`;

    return new AppError(message, 400);
}

const handleJsonWebTokenError = () => new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () => new AppError('Expired token. Please log in again!', 401);

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendProdError = (err, res) => {
    console.log(err);
    // If operational error - send full info to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

    // Program or unknown error - won't dispose error details, send a generic message to client
    } else {
        console.error('>>> ERROR: ', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        console.log(err);
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // TODO
        let error = { ...err };
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.code === 11000) error = handleDuplicateEntryErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
        sendProdError(error, res);
    }
}