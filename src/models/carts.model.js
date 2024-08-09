import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    products: { type: [{ product: mongoose.Schema.Types.ObjectId, quantity: Number }], required: true, ref: 'products' }
},
{ versionKey: false }
);

const model = mongoose.model(collection, schema);

export default model;
