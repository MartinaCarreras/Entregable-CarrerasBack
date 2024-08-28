import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, enum: ['usuario', 'admin'], default: 'usuario', required: true},
    gender: {type: String, enum: ['Female', 'Male', 'None'], required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    _cart_id: {type: String, required: true}
});

const model = mongoose.model(collection, schema);

export default model;