const Book = require('../models/Book');
const User = require('../models/User');

exports.getPendingBooks = async (req, res) => {
  try {
    const pendingBooks = await Book.find({ isApproved: false })
      .populate('author', 'username email');
    res.json(pendingBooks);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في جلب الكتب المعلقة' });
  }
};

exports.approveBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findByIdAndUpdate(
      bookId,
      { isApproved: true },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    res.json({ message: 'تم الموافقة على الكتاب بنجاح', book });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في الموافقة على الكتاب' });
  }
};

exports.getSiteEarnings = async (req, res) => {
  try {
    const books = await Book.find({ isApproved: true });
    let totalEarnings = 0;

    books.forEach(book => {
      // حساب 15% من مبيعات كل كتاب
      const bookEarnings = (book.price * book.purchases.length) * 0.15;
      totalEarnings += bookEarnings;
    });

    res.json({ totalEarnings });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في حساب الأرباح' });
  }
};

exports.getAuthorEarnings = async (req, res) => {
  try {
    const authors = await User.find({ role: 'author' });
    const earningsData = [];

    for (const author of authors) {
      const books = await Book.find({ 
        author: author._id,
        isApproved: true 
      });

      let authorTotalEarnings = 0;
      books.forEach(book => {
        // حساب 85% من مبيعات كل كتاب
        const bookEarnings = (book.price * book.purchases.length) * 0.85;
        authorTotalEarnings += bookEarnings;
      });

      earningsData.push({
        authorId: author._id,
        username: author.username,
        email: author.email,
        totalEarnings: authorTotalEarnings,
        balance: author.balance
      });
    }

    res.json(earningsData);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في جلب أرباح الكتاب' });
  }
}; 