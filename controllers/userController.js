const User = require('./../models/User');
const AppError = require('../utils/AppError');
const jwt = require('../utils/jwt');

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

exports.verifyLogin = async (req, res, next) => {
    const token = req.body.token || '';
    jwt.verifyToken(token)
        .then(data => {
            User.findById(data.id)
                .then(user => {
                    return res.status(200).json({
                        status: true,
                        user
                    });
                });
        })
        .catch(err => {
            if(['jwt must be provided'].includes(err.message)) {
                res.status(401).send('Unauthorized!');
                return;
            }

            res.send({
                status: false
            });
        })
}

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
