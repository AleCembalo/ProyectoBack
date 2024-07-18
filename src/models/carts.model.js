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


// const productSchema = new mongoose.Schema({
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
//     quantity: Number
// }, { _id: false });

// const cartSchema = new mongoose.Schema({
//     products: { type: [productSchema], required: true }
// }, { versionKey: false });

// const model = mongoose.model(collection, cartSchema);

// export default model;
