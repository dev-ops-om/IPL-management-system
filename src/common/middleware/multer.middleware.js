import multer from "multer";
import path from "path";

const fileFilter=(req,file,cb)=>{
    const allowed=["image/png","image/jpeg","image/gif","image/webp"];

    if(allowed.includes(file.mimetype)){
      cb(null,true);
    }
    else{
      cb(new Error("file Type not supported"),false)
    }

}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Folder location
  },
  filename: (req, file, cb) => {
    // Generate unique name to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


export const upload=multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter:fileFilter
})