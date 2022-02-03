const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    product_details : {
        regulatory_model_name: {
            type: String,
            required: true
        },
        product_name: {
            type: String,
            required: true
        },
        product_family: {
            type: String,
            required: true
        },
        product_category: {
            type: String,
            required: true
        },
        product_description: {
            type: String,
            required: true
        },
        model_difference: {
            type: String,
            required: true
        },
        intended_environment: {
            type: String,
            required: true
        },
        applicable_standard: {
            type: String,
            required: true
        },
        applicant: {
            name: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
        },
        manufacturer: [
            {
                name: {
                    type: String,
                    required: true
                },
                address: {
                    type: String,
                    required: true
                },
                phone_number: {
                    type: String,
                    required: true
                },
            }
        ],
        trade_mark: {
            status: {
                type: Boolean,
                required: true
            },
            data: {
                type: String,
                required: true
            },
        },
        family_series_model: {
            type: Array,
            required: true
        },
        market: [
            {
                continent_code: {
                    type: String,
                    required: true
                },
                continent_name: {
                    type: String,
                    required: true
                },
                country_code: {
                    type: String,
                    required: true
                },
                country_name: {
                    type: String,
                    required: true
                }
            }
        ]
    }
})