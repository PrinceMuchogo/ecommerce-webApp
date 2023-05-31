import asyncHandler from 'express-async-handler';
import Laptop from '../models/laptopModel.js';
import Phone from '../models/phoneModel.js';




// Get all products
// route GET /api/product

const getAllProducts = asyncHandler(async (req, res) => {

    const phones = await Phone.find();
    const laptops = await Laptop.find();
    
        if (!phones || !laptops) {
            res.status(404);
            throw new Error('An error occured');
        }
        
    res.status(200).json({
        phones: phones,
        laptops: laptops
    });
});

export { getAllProducts };


