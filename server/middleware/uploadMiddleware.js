import multer from 'multer'
import path from 'path'

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const filename=Date.now() + ext
        cb(null,filename)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'application/pdf'){
        cb(null,true)
    }else{
        cb(new Error('Only PDF files are allowed'),false)
    }
}

const upload = multer({storage,fileFilter})

export default upload