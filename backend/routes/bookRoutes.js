const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const authorMiddleware = require('../middleware/authorMiddleware');
const { uploadPdf, uploadImage } = require('../config/upload');

// التأكد من أن المستخدم كاتب
router.use(authMiddleware, authorMiddleware);

// رفع الكتاب
router.post('/upload',
  uploadPdf.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  bookController.uploadBook
);

// جلب كتب الكاتب
router.get('/my-books', bookController.getAuthorBooks);

// تحديث الكتاب
router.put('/:bookId',
  uploadPdf.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  bookController.updateBook
);

// حذف الكتاب
router.delete('/:bookId', bookController.deleteBook);

module.exports = router; 