const express = require('express');
const router = express.Router();
const readerController = require('../controllers/readerController');
const authMiddleware = require('../middleware/authMiddleware');

// راوترز عامة
router.get('/books', readerController.getAllBooks);
router.get('/books/:bookId', authMiddleware, readerController.getBookDetails);

// راوترز تتطلب تسجيل الدخول
router.use(authMiddleware);
router.get('/read/:bookId', readerController.readBook);
router.post('/books/:bookId/rate', readerController.rateBook);

module.exports = router; 