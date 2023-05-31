import asyncHandler from 'express-async-handler';




const makePayment = asyncHandler(async (req, res) => {


    const { products } = req.body;
    
    let line_items = [];
    
    if (line_items) {

        for (let product of products) {
           const item =
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.cost,
                },
                quantity: product.quantity
            }

            line_items.push(item);

        };

        res.status(200).json({
            line_items
        })
    } else {

        res.status(400);
        throw new Error('bad request!!!');
    };
    

    

});


export { makePayment };
