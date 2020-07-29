const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        validate: {
            validator: function(value) {
                return validator.isEmail(value);
            },
            message: 'Please input a valid email address'
        }
    },
    userAccess: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePhoto: {
        type: String,
        default: 'https://res.cloudinary.com/dghpuejpt/image/upload/v1596012698/user/profile-photo-default_tyrflc.png'
    },
    tripsCompleted: [{
        type: 'ObjectId',
        ref: 'Trip'
    }],
    tripsLiked: [{
        type: 'ObjectId',
        ref: 'Trip'
    }],
    journal: [{}],
    comments: [{}],
    totalHeightClimbed: {
        type: Number,
        default: 0
    }
})

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;