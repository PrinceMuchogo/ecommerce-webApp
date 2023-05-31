import express from 'express';
const router = express.Router();
import { makePayment } from '../controllers/testController.js';


router.post('/', makePayment);

export default router;