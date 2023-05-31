import asyncHandler from 'express-async-handler';
import Laptop from '../models/laptopModel.js';
import Order from '../models/orderModel.js';
import Phone from '../models/phoneModel.js';


const createOrder = asyncHandler( async (req, res) => {
 
    const { customerId, laptops, phones, totalAmount, receiversName, address, country } = req.body;

    let products = [];
    for (let laptop of laptops) {

        products.push(laptop);
    }
    for (let phone of phones) {

        products.push(phone);
    }
    
   console.log(products);


    const order = await Order.create({
        customerId,
        products,
        totalAmount,
        receiversName,
        address,
        country
    });

    
    if (order) {

        res.status(201).json({
            message: 'Order placed successfully'
        });


    } else {
        res.status(400);
        throw new Error('Invalid data');

    }
    
});


export { createOrder };