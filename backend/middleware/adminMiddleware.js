const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'غير مصرح لك بالوصول إلى هذه الصفحة' 
    });
  }
  next();
};

module.exports = adminMiddleware; 