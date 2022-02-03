const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'guest',
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)