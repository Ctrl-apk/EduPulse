import express from 'express'
import upload from '../middleware/uploadMiddleware.js'; // ✅ required!
import {generateSummary} from '../controllers/summaryController.js'
const router = express.Router()

router.post('/',upload.single('pdf'),generateSummary)
export default router