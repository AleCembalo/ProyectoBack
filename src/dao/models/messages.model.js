
import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'products';
const schema = new mongoose.Schema({
    
});

const model = mongoose.model(collection, schema);

export default model;