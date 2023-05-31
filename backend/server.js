import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_KEY);
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import testRoutes from './routes/testRoute.js';


connectDB(); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);

app.use('/stripe', stripeRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/test', testRoutes);

app.post('/api/stripe/create-checkout-session', async (req, res) => {

    const { products } = req.body;

    let line_items = [];

    for (let product of products) {
        const item =
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    images: [product.imageUrl]
                },
                unit_amount: product.price * 100,
            },
            quantity: product.qauntity
        }
        line_items.push(item);
    };

    /*
    if (!line_items) {

        res.status(400);
        throw new Error('bad request!!!');
    };
    */

    const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
            allowed_countries: ['US', 'CA','ZW'],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500,
                        currency: 'usd',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 1,
                        },
                    },
                },
            },
        ],
        phone_number_collection: {
            enabled: true
        },
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/myCart`,
    });

    res.send({ url: session.url });
});

app.get('/', (req, res) => res.send('Server is ready')); 

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));