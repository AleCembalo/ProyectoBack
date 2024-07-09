import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users', default: '667f43a4c69cc40e7e33a096' },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
},{ versionKey: false }
);

const model = mongoose.model(collection, schema);

export default model;