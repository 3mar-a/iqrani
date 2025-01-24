const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// راوتر التسجيل وتسجيل الدخول
router.post('/register', authController.register);
router.post('/login', authController.login);

// راوتر للتحقق من حالة المصادقة
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router; 