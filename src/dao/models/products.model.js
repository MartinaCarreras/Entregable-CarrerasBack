import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    thumbnail: { type: String, required: true },
    stock: { type: String, required: true },
    id: { type:Number, required: true }
});

const model = mongoose.model(collection, schema);

export default model;