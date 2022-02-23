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
    role:[{
        type: String,
        enum: ['Super_Admin', 'Admin', 'Author', 'Viewer', 'Reviewer', 'Approver'],
        default: 'Viewer',
        required: true
    }],
    refreshToken:{
        type: String
    }
})

module.exports = mongoose.model('User', UserSchema)