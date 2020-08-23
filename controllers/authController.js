const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwt = require('../utils/jwt');

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = jwt.createToken({ id: newUser._id });

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
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

        const token = jwt.createToken({ id: user._id });
        
        res.status(200).json({
            status: 'success',
            token
        });
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
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};