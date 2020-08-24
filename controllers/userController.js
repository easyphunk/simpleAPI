const User = require('./../models/User');
const AppError = require('../utils/AppError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    
    Object.keys(obj).map(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    
    return newObj;
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('_id email username userAccess');

        res.status(200).json({
                status: 'success',
                results: users.length,
                data: {
                    users
                }
            });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new AppError('No user found with this ID', 404);
        }

        res.status(200).json({
                status: 'success',
                data: {
                    user
                }
            });
    } catch (err) {
        next(err);
    }
};

exports.updateCurrentUser = async (req, res, next) => {
    try {
        // throw error if user POSTs password data
        if (req.body.password || req.body.confirmPassword) {
            return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
        }
        
        const filteredBody = filterObj(req.body, 'username', 'email');
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        })
    
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        })
    } catch (err) {
        next(err);
    }
};

exports.deleteCurrentUser = async (req, res, next) => {
    // not actual deleting
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            throw new AppError('No user found with this ID', 404);
        }

        res.status(200).json({
                status: 'success',
                data: {
                    user
                }
            });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            throw new AppError('No user found with this ID', 404);
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        next(err);
    }
};
