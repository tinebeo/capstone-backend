const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confrimPassword:{
        type: String,
    },
    role:{
        type: String,
        enum: ['guest', 'reader', 'editor', 'superuser'],
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)