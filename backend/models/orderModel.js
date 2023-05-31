import mongoose from 'mongoose';
import Laptop from '../models/laptopModel.js';
import Phone from '../models/phoneModel.js';

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true
    },
    products: Array,
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    estimatedDeliveryDate: String,
    receiversName: String,
    address: String,
    country: String

}, {
    timestamps: true
});


orderSchema.pre('save', async function (next) {

        const productsPromise = this.products.map(async id => {
            
            let test = await Laptop.findById(id);
            
            if (!test) {
                test = (await Phone.findById(id));
            }
            return test;
            
        });
        this.products = await Promise.all(productsPromise);
        

   
    next();
});




/*
orderSchema.pre('save', async function (next) {
    const productsPromise = this.products.map(async id => await Laptop.findById(id));
    this.products = await Promise.all(productsPromise);


    next();
        })
*/

            
       
const Order = mongoose.model('Order', orderSchema);
export default Order;
