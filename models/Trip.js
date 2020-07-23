const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The trip must have a name'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'The trip must have a location'],
        trim: true
    },
    latitude: {
        type: Number,
        required: [true, 'The trip must have a latitude']
    },
    longitude: {
        type: Number,
        required: [true, 'The trip must have a longitude']
    },
    elevation: {
        type: Number,
        required: [true, 'The trip must have an elevation']
    },
    coverImage: {
        type: String,
        required: [true, 'The trip must have a cover image'],
        trim: true
    },
    overview: {
        type: String,
        required: [true, 'The trip must have an overview'],
        trim: true,
        minlength: [50, 'The trip overview must be at least 50 characters long']
    },
    climbingHistory: {
        type: String,
        required: [true, 'The trip must have a climbing history'],
        trim: true
    },
    whenToClimb: {
        type: String,
        required: [true, 'The trip must have a when-to-climb info'],
        trim: true
    },
    gettingThere: {
        type: String,
        required: [true, 'The trip must have a getting-there info'],
        trim: true
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    completedBy: [{
        type: 'ObjectId',
        ref: 'User'
    }],
    images: [String],
    comments: [{}]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tripSchema.virtual('mapboxCoordinates').get(function() {
    const mapboxObject = {
        lng: this.longitude,
        alt: this.latitude,
        zoom: 2
    }
    return mapboxObject;
})

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;