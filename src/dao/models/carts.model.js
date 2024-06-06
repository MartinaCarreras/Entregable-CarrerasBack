import mongoose, { Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    products: {type: [{_product_id: {type: mongoose.Schema.Types.ObjectId}, quantity: {type: Number}}], ref: 'products'}
});
schema.plugin(mongoosePaginate);
const model = mongoose.model(collection, schema);

export default model;