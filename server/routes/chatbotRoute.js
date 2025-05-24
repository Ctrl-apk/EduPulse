// routes/chatbotRoute.js
import express from 'express';
import { askPerplexity } from '../controllers/chatbotController.js';
const router = express.Router();

router.post('/', askPerplexity);
export default router;
