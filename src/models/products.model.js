
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'products';
const schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['Fontanería', 'Herramientas', 'Electricidad'] },
    status: { type: Boolean, required: true },
    thumbnails: { type: String, required: true, default: [] },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
}, {
    versionKey: false
});

schema.plugin(mongoosePaginate);
const model = mongoose.model(collection, schema);

export default model;