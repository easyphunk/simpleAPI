const User = require('../models/User');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const jwt = require('../utils/jwt');
const crypto = require('crypto');

const createSendToken = (user, statusCode, res) => {
    const token = jwt.createToken({ id: user._id });
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    // remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });
        createSendToken(newUser, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return next(new AppError('Incorrect email or password!', 401));
        }

        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};

exports.authCheck = async (req, res, next) => {
    try {
        let token;
        // Check if token exists
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not logged in!', 401))
        }
        // Verify the token
        const decodedToken = await jwt.verifyToken(token);

        // Check if user still exists
        const userExists = await User.findById(decodedToken.id);

        if (!userExists) {
            return next(new AppError('This user no longer exists!', 401));
        }

        // Check if user changed password after this token was issued
        if (userExists.changedPasswordAfter(decodedToken.iat)) {
            return next(new AppError('Password has been changed. Please log in again!', 401));
        }

        // If all good, proceed to protected route
        req.user = userExists;
        next();
    } catch (err) {
        next(err);
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }

        next();
    };
};

exports.forgotPassword = async (req, res, next) => {
    try {
        // Check for user in DB by email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new AppError('No user found with this email address.', 404));
        }

        // Generate random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

        const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't request a password reset - ignore this message.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset (valid for 10 minutes)',
                message
            });

            res.status(200).json({
                status: 'success',
                message: 'Email sent to user!'
            })
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new AppError('There was an error sending the email. Please try again later!', 500));
        }

    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        // get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // if token hasn't expired and user exists
        if (!user) {
            return next(new AppError('Token is invalid/expired', 400));
        }

        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // Log the user in via JWT
        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
    
        if (!(await user.matchPassword(req.body.passwordCurrent))) {
            return next(new AppError('Current password incorrect', 401));
        }

        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();

        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};