const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// تخزين ملفات PDF
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'iqrani/books',
    resource_type: 'raw',
    allowed_formats: ['pdf']
  }
});

// تخزين الصور
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'iqrani/images',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const uploadPdf = multer({ storage: pdfStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { uploadPdf, uploadImage }; 