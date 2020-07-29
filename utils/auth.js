const jwt = require('./jwt');
const User = require('../models/User');

module.exports = (redirectAuthenticated = true) => {
    return function (req, res, next) {
        const token = req.cookies['x-auth-token'] || '';

        jwt.verifyToken(token)
            .then((data) => {
                User.findById(data.id)
                    .then((user) => {
                        req.user = user;
                        next();
                    });
            })
            .catch(err => {
                console.err('>>> ERROR: ', err);
                if (!redirectAuthenticated) { next(); return; }

                if (['jwt must be provided'].includes(err.message)) {
                    res.status(401).send('Unauthorized!');
                    return;
                }

                next(err);
            })
    }
};