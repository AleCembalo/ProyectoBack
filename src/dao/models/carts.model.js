
import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';
const schema = new mongoose.Schema({

    products: [{ type: [{ _id: mongoose.Schema.Types.ObjectId}, {quantity: Number }], required: true, ref: 'products' }]

});

const model = mongoose.model(collection, schema);

export default model;