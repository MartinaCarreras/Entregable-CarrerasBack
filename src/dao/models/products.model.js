import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true },
    category: {type: String, enum: ['lacteos', 'frutas', 'deshidratado', 'carne', 'bebidas'], required: true},
    _id: {type: mongoose.Schema.Types.ObjectId, required: true}
});
schema.plugin(mongoosePaginate);

const model = mongoose.model(collection, schema);

export default model;