import express from 'express';
const router = express.Router();
import { stripePayment } from '../controllers/stripeController.js';

router.post('/create-checkout-session', stripePayment);


export default router;