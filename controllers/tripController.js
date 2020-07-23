const Trip = require('./../models/Trip');
const APIFeatuers = require('./../utils/apiFeatures');

exports.aliasTopTrips = async (req, res, next) => {
    req.query.limit = '3';
    req.query.sort = '-likes';
    next();
}

exports.getAllTrips = async (req, res) => {
    try {
        // Execute query
        const queryFeatures = new APIFeatuers(Trip.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const trips = await queryFeatures.query;

        // Send response
        res.status(200).json({
            status: 'success',
            results: trips.length,
            data: {
                trips
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                trip
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const newTrip = await Trip.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                trip: newTrip
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                trip
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}

exports.deleteTrip = async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}
