const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: 6,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // Only works on CREATE & SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        // validate: [validator.isEmail, 'Please input a valid email address']
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Please input a valid email address'
        },
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePhoto: {
        type: String
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
    matchPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
    changedPasswordAfter: function (JWTTimestamp) {
        if (this.passwordChangedAt) {
            const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
            return JWTTimestamp < changedTimestamp;
        }

        // false = not changed
        return false;
    },
    createPasswordResetToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        console.log(resetToken, this.passwordResetToken);

        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        return resetToken;
    }
};

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = undefined;
    }
    next();
});

userSchema.pre('save', function (next) {
    if (this.isModified('password') || !this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;