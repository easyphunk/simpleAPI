const User = require('./../models/User');
const AppError = require('../utils/AppError');
const jwt = require('../utils/jwt');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res
            .status(200)
            .json({
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

        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    user
                }
            });
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        console.log(newUser);
        const token = jwt.createToken({ id: newUser._id });

        res
            .status(200)
            .header('Authorization', token)
            .json({
                status: 'success',
                data: {
                    user: newUser
                }
            });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            throw new AppError('No user found with this username', 404);
        }

        const match = await user.matchPassword(password);
        if (!match) {
            res
                .status(401)
                .json({
                    status: 'fail',
                    message: 'Invalid Password!'
                })
            return;
        }

        const token = jwt.createToken({ id: user._id });
        
        res
            .header('Authorization', token)
            .json({
                status: 'success',
                data: {
                    user
                }
            })

    } catch (err) {
        next(err);
    }
}

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

        res
            .status(200)
            .json({
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
