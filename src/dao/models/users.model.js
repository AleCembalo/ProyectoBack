
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'premium', 'user'], default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'carts', }
});

schema.plugin(mongoosePaginate);
const model = mongoose.model(collection, schema);

export default model;