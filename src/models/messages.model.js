import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'messages';

const schema = new mongoose.Schema({

    
    
},{ versionKey: false }
);

const model = mongoose.model(collection, schema);

export default model;