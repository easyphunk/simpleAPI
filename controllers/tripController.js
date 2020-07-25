const Trip = require('./../models/Trip');
const DBRequestFeatures = require('../utils/DBRequestFeatures');
const AppError = require('../utils/AppError');

exports.aliasTopTrips = async (req, res, next) => {
    req.query.limit = '3';
    req.query.sort = '-likes';
    next();
};

exports.getAllTrips = async (req, res, next) => {
    try {
        // Execute query
        const dbRequest = new DBRequestFeatures(Trip.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const trips = await dbRequest.query;

        // Send response
        res.status(200).json({
            status: 'success',
            results: trips.length,
            data: {
                trips
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            throw new AppError('No trip found with this ID', 404);
        }
        res.status(200).json({
            status: 'success',
            data: {
                trip
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.createTrip = async (req, res, next) => {
    try {
        const newTrip = await Trip.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                trip: newTrip
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!trip) {
            throw new AppError('No trip found with this ID', 404);
        }

        res.status(200).json({
            status: 'success',
            data: {
                trip
            }
        });
    } catch (err) {
        next(err);
    }

};

exports.deleteTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);

        if (!trip) {
            throw new AppError('No trip found with this ID', 404);
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        next(err);
    }

};

exports.getTripStats = async (req, res, next) => {
    try {
        const stats = await Trip.aggregate([
            {
                $match: { elevation: { $gte: 0 } }
            },
            {
                $group: {
                    _id: '$location',
                    countTrips: { $sum: 1},
                    avgViews: { $avg: '$views' },
                    avgLikes: { $avg: '$likes'},
                    avgElevation: { $avg: '$elevation' },
                    minElevation: { $min: '$elevation' },
                    maxElevation: { $max: '$elevation' }
                }
            },
            {
                $sort: {
                    avgViews: 1
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            results: stats.length,
            data: {
                stats
            }
        });
        
    } catch (err) {
        next(err);
    }
};