
import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';
const schema = new mongoose.Schema({
    products: [
        {
            product: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ]
});

const model = mongoose.model(collection, schema);

export default model;