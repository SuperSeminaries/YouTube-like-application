import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir =  'public/temp'
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir,  { recursive: true })  
        }
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname + '-' + uniqueSuffix)
    }
  })
  
 export const upload = multer({ storage: storage })