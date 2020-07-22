const fs = require('fs');

const trips = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    console.log(`Trip ID requested is: ${val}`);
    if (req.params.id * 1 > trips.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing price or name'
        });
    }
    next();
}

exports.getAllTrips = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: trips.length,
        data: {
            trips
        }
    });
};

exports.getTrip = (req, res) => {
    const trip = trips.find(trip => Number(trip.id) === Number(req.params.id));

    res.status(200).json({
        status: 'success',
        data: {
            trip
        }
    });
};

exports.createTrip = (req, res) => {
    const newId = trips[trips.length - 1].id + 1;
    const newTrip = Object.assign({ id: newId }, req.body);

    trips.push(newTrip);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(trips), err => {
        res.status(201).json({
            status: 'success',
            data: {
                trip: newTrip
            }
        })
    })
};

exports.updateTrip = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined!'
        });
}

exports.deleteTrip = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined!'
        });
}
