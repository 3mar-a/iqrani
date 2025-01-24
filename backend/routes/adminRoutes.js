const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// التأكد من أن المستخدم مسجل دخول وأنه أدمن
router.use(authMiddleware, adminMiddleware);

// راوتر إدارة الكتب
router.get('/pending-books', adminController.getPendingBooks);
router.put('/approve-book/:bookId', adminController.approveBook);

// راوتر إدارة الأرباح
router.get('/site-earnings', adminController.getSiteEarnings);
router.get('/author-earnings', adminController.getAuthorEarnings);

module.exports = router; 