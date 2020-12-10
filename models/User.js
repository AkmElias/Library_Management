const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    Email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    Role: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    Date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users',UserSchema)