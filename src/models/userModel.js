"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    // const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required'],
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        maxLength: 250,
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        maxLength: 50,
    },
    mobileCountryCode: {
        type: String,
        default: '+91',
    },
    mobile: {
        type: String,
        required: [true, 'mobile is required'],
        unique: true,
        maxLength: 15,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    profileImage: String,
    role: {
        type: String,
        enum: ['User', 'Manager', 'Admin'],
        required: true,
    },
    address1: {
        type: String,
        maxLength: 100,
    },
    address2: {
        type: String,
        maxLength: 100,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lastLoginAttempt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Users', userSchema);
