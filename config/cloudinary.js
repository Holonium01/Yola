const multer = require('multer'),
    cloudinary = require('cloudinary'),
    cloudinaryStorage = require('multer-storage-cloudinary');

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "image",
    allowedFormats: ["jpg", "png", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});

let fileFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only JPG, JPEG, and PNG formats are supported'), false)
    }
    cb(null, true)
}

const parser = multer({ storage: storage, fileFilter: fileFilter });

module.exports.parser = parser;