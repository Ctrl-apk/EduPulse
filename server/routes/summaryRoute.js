import express from 'express'
import {generateSummary} from '../controllers/summaryController.js'
import multer from 'multer';
const router = express.Router()
const upload = multer({ dest: 'uploads/' }); 

router.post('/generate',upload.single('pdf'),generateSummary)
export default router