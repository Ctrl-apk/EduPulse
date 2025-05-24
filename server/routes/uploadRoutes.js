import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
const router = express.Router()

router.post('/upload-pdf',upload.single('pdf'),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:'No PDF file uploaded'})
    }
    res.json({message:'PDF uploaded successfully',file:req.file.filename})
})
export default router