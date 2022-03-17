const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    user_id:{
        type: String
    },
    product_details : {
        regulatory_model_name: {
            type: String,
        },
        product_name: {
            type: String,
        },
        product_family: {
            type: String,
        },
        product_category: {
            type: String,
        },
        product_description: {
            type: String,
        },
        model_difference: {
            type: String,
        },
        intended_environment: [{
            type: String
        }],
        applicable_standard: {
            type: String,
        },
        applicant: {
            name: {
                type: String,
            },
            address: {
                type: String,
            },
        },
        manufacturer: [{
            name: {
                type: String,
             },
            address: {
                type: String,
            },
            phone_number: {
                type: String,
            },
        }],
        trade_mark: {
            status: {
                type: Boolean,
            },
            data: {
                type: String,
            },
        },
        //only the something come up when trade_mark
        family_series_model: {
            type: Array,
        },
        market: [{
            continent_code: {
                type: String,
            },
            continent_name: {
                type: String,
            },
            country_code: {
                type: String,
            },
            country_name: {
                type: String,
            }
        }]
    },
    product_tech_details: {
        equipment_size: {
            width: {
                type: Number
            },
            length: {
                type: Number
            },
            height: {
                type: Number
            },
            unit: {
                type: String
            },
        },
        equipment_weight: {
            type: Number
        },
        power_rating: {
            voltage: {
                type: Number
            },
            phase: {
                type: Number
            },
            frequency: {
                type: Number
            },
            power: {
                type: Number
            },
            current: {
                type: Number
            }
        },
        operation_mode: {
            selected_mode: {
                type: String
            },
            ratio: {
                type: Number
            }
        },
        use_classification: [{
            type: String
        }],
        supply_connection: [{
            type: String
        }],
        mobility: [{
            type: String
        }]
    },
    product_env_details: {
        pollution_degree: {
            type: String
        },
        max_operating_ambient: {
            type: Number
        },
        ingree_protection_classification: {
            type: String
        },
        operation_altitude: {
            type: Number
        },
        equipment_mass: {
            type: Number
        },
        relative_humidity: {
            type: Number
        },
        atmospheric_pressure: {
            type: Number
        },
        indoor_outdoor: {
            type: String
        }
    },
    marking_and_doc: {
        marking_plate:[{
            name: {
                type: String
            },
            file_location: {
                type: String
            }
        }],
        warning_mark: [{
            name: {
                type: String
            },
            file_location: {
                type: String
            }
        }],
        fuse_type: {
            type: String
        }
    },
    compliance_report_number: [{
        type: String
    }],
    is_compliant: {
        type: Boolean
    },
    last_updated_status: {
        last_updated_by: {
            type: String
        },
        last_updated_date: {
            type: Date
        },
        active_standard: {
            type: String
        }
    }
})

module.exports = mongoose.model('Product', productSchema)