import mongoose, { Types } from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    id: {type: String, required: true},
    products: {type: Object, required: true}
});

const model = mongoose.model(collection, schema);

export default model;