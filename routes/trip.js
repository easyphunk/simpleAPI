const express = require('express');
const tripController = require('../controllers/tripController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/top-trips')
    .get(tripController.aliasTopTrips, tripController.getAllTrips);

router
    .route('/trip-stats')
    .get(tripController.getTripStats)

router
    .route('/')
    .get(authController.authCheck, tripController.getAllTrips)
    .post(tripController.createTrip);

router
    .route('/:id')
    .get(tripController.getTrip)
    .patch(tripController.updateTrip)
    .delete(tripController.deleteTrip);

module.exports = router;