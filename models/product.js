const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    product_id: {
        type: Number,
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
        manufacturer: [{
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
        }],
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
        //only the something come up when trade_mark
        family_series_model: {
            type: Array,
            required: true
        },
        market: [{
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