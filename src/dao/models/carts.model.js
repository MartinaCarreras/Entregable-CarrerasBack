import mongoose, { Types } from 'mongoose';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    id: {type: Number, required: true},
    products: {type: [{_product_id: mongoose.Schema.Types.ObjectId, quantity: Number}], ref: 'products'}
});

const model = mongoose.model(collection, schema);

export default model;