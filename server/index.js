/* eslint-env node */

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import uploadRoutes from './routes/uploadRoutes.js'
import summaryRoutes from './routes/summaryRoute.js'
import quizRoutes  from './routes/quizRoute.js'
import chatbotRoutes from "./routes/chatbotRoute.js";

import fs from 'fs';
import path from 'path';

dotenv.config()
const app = express()


//Middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/chatbot", chatbotRoutes);


///routes
app.use('/api/upload',uploadRoutes)
app.use('/api/summary',summaryRoutes)
app.use('/api/quiz',quizRoutes)
app.use("/api/chatbot", chatbotRoutes);


app.get('/',(req,res)=>{
    res.send('EduPulse backend is running')
})


const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Created uploads directory');
} else {
  console.log('Uploads directory already exists');
}

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

