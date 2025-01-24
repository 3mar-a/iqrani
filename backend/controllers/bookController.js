const Book = require('../models/Book');
const cloudinary = require('cloudinary').v2;

exports.uploadBook = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    if (!req.files.pdf || !req.files.cover) {
      return res.status(400).json({ message: 'يرجى رفع ملف PDF وصورة الغلاف' });
    }

    const book = new Book({
      title,
      description,
      price,
      category,
      author: req.user._id,
      pdfFile: req.files.pdf[0].path,
      coverImage: req.files.cover[0].path
    });

    await book.save();

    res.status(201).json({
      message: 'تم رفع الكتاب بنجاح وسيتم مراجعته من قبل الإدارة',
      book
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في رفع الكتاب' });
  }
};

exports.getAuthorBooks = async (req, res) => {
  try {
    const books = await Book.find({ author: req.user._id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في جلب الكتب' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, description, price, category } = req.body;

    const book = await Book.findOne({ _id: bookId, author: req.user._id });
    if (!book) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    if (book.isApproved) {
      return res.status(400).json({ message: 'لا يمكن تعديل كتاب تمت الموافقة عليه' });
    }

    // تحديث معلومات الكتاب
    book.title = title;
    book.description = description;
    book.price = price;
    book.category = category;

    // تحديث الملفات إذا تم رفعها
    if (req.files.pdf) {
      // حذف الملف القديم
      const oldPdfId = book.pdfFile.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldPdfId, { resource_type: 'raw' });
      book.pdfFile = req.files.pdf[0].path;
    }

    if (req.files.cover) {
      // حذف الصورة القديمة
      const oldCoverId = book.coverImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldCoverId);
      book.coverImage = req.files.cover[0].path;
    }

    await book.save();
    res.json({ message: 'تم تحديث الكتاب بنجاح', book });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في تحديث الكتاب' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ _id: bookId, author: req.user._id });

    if (!book) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    if (book.isApproved && book.purchases.length > 0) {
      return res.status(400).json({ message: 'لا يمكن حذف كتاب تم شراؤه' });
    }

    // حذف الملفات من كلاودناري
    const pdfId = book.pdfFile.split('/').pop().split('.')[0];
    const coverId = book.coverImage.split('/').pop().split('.')[0];
    
    await cloudinary.uploader.destroy(pdfId, { resource_type: 'raw' });
    await cloudinary.uploader.destroy(coverId);

    await book.remove();
    res.json({ message: 'تم حذف الكتاب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في حذف الكتاب' });
  }
}; 