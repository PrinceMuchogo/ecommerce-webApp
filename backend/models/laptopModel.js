import mongoose from 'mongoose';

const laptopSchema = new mongoose.Schema({
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
    warranty: {
        type: String,
        enum: ['6 months', '12 months', '24 months'],
        default: '3 months'
    },
    imageUrl: String
})

const Laptop = mongoose.model('Laptop', laptopSchema);
export default Laptop;
