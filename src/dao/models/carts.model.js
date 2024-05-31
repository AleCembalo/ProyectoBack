import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "carts";
const schema = new mongoose.Schema({

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
    }, ],
});

const model = mongoose.model(collection, schema);

export default model;