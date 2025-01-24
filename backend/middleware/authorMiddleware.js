const authorMiddleware = (req, res, next) => {
  if (req.user.role !== 'author') {
    return res.status(403).json({ 
      message: 'هذه الخدمة متاحة للكتاب فقط' 
    });
  }
  next();
};

module.exports = authorMiddleware; 