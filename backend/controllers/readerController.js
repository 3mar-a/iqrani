const Book = require('../models/Book');
const { PDFDocument } = require('pdf-lib');
const cloudinary = require('cloudinary').v2;

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isApproved: true })
      .populate('author', 'username')
      .select('-pdfFile');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في جلب الكتب' });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId)
      .populate('author', 'username')
      .select('-pdfFile');
    
    if (!book || !book.isApproved) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    // إضافة معلومات إذا كان المستخدم قد اشترى الكتاب
    const hasPurchased = book.purchases.includes(req.user._id);
    
    res.json({
      ...book.toJSON(),
      hasPurchased
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في جلب تفاصيل الكتاب' });
  }
};

exports.readBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    
    if (!book || !book.isApproved) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    // التحقق من أن المستخدم قد اشترى الكتاب
    if (!book.purchases.includes(req.user._id)) {
      return res.status(403).json({ message: 'يجب شراء الكتاب أولاً' });
    }

    // جلب ملف PDF من كلاودناري
    const pdfUrl = book.pdfFile;
    
    // إرسال رابط القراءة المؤقت
    const signedUrl = cloudinary.utils.private_download_url(pdfUrl, 'pdf', {
      expires_at: Math.floor(Date.now() / 1000) + 3600 // صالح لمدة ساعة
    });

    res.json({ readUrl: signedUrl });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في تحميل الكتاب' });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, review } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.isApproved) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    // التحقق من أن المستخدم قد اشترى الكتاب
    if (!book.purchases.includes(req.user._id)) {
      return res.status(403).json({ message: 'يمكن فقط للمشترين تقييم الكتاب' });
    }

    // التحقق من عدم وجود تقييم سابق
    const existingRating = book.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
      return res.status(400).json({ message: 'لقد قمت بتقييم هذا الكتاب مسبقاً' });
    }

    // إضافة التقييم
    book.ratings.push({
      user: req.user._id,
      rating,
      review
    });

    // تحديث متوسط التقييم
    const totalRatings = book.ratings.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating = totalRatings / book.ratings.length;

    await book.save();
    res.json({ message: 'تم إضافة تقييمك بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في إضافة التقييم' });
  }
}; 