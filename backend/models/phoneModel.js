import mongoose from 'mongoose';

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: String
})

const Phone = mongoose.model('Phone', phoneSchema);
export default Phone;
