import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'tickets';

const schema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
        default: 0.0
    },
    purchaser: {
        type: String,
        required: true
    }
    
},{ versionKey: false }
);

const model = mongoose.model(collection, schema);

export default model;