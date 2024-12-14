import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    // Specify the directory where files will be saved
    cb(null, "BoardingHouseWebsite/resources/images/"); // 'uploads' directory must exist in your project folder
},
filename: (req, file, cb) => {
    // Save the file with a unique name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
},
});
const upload = multer({
storage: storage,
limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
fileFilter: (req, file, cb) => {
    // Validate file type (only accept images)
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
    cb(null, true);
    } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif)."));
    }
},
});

export default upload;