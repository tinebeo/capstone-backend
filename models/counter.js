const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    seqName: {
        type: String,
        unique: true,
        required: true
    },
    seqCounter:{
        type: Number,
        default: 1,
        max:999999
    }
})

module.exports = mongoose.model('Counter', counterSchema)