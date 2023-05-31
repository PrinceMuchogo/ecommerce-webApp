import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_KEY);

//app.post('/create-checkout-session', async (req, res) => {

const stripePayment = asyncHandler(async (req, res) => {

    const { products } = req.body;

    let line_items = [];

    

        for (let product of products) {
            const item =
            {
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.cost * 100,
                },
                quantity: product.quantity
            }

            line_items.push(item);

        };

    if (!line_items) {

        res.status(400);
        throw new Error('bad request!!!');
    };


    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({url: session.url});
});


export {
    stripePayment
}