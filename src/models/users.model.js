import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

// const collection = 'users_test';
const collection = 'users';

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'premium', 'user'],
        default: 'user'
    },
    documents: [
        {
            name: {
                type: String
            },
            reference: {
                type: String
            }
        }
    ],
    last_connection: {
        type: Date,
        default: Date.now
    },
    active: { 
        type: Boolean, 
        default: true 
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'carts'
    }
}, {
    versionKey: false
});

schema.plugin(mongoosePaginate);
const model = mongoose.model(collection, schema);

export default model;