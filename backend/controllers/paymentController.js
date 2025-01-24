const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Book = require('../models/Book');
const User = require('../models/User');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    
    if (!book || !book.isApproved) {
      return res.status(404).json({ message: 'الكتاب غير متوفر للشراء' });
    }

    // التحقق من أن المستخدم لم يشتري الكتاب مسبقاً
    if (book.purchases.includes(req.user._id)) {
      return res.status(400).json({ message: 'لقد قمت بشراء هذا الكتاب مسبقاً' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: book.price * 100, // Stripe يتعامل بالسنت
      currency: 'usd',
      metadata: {
        bookId: book._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في إنشاء عملية الدفع' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const { bookId, userId } = paymentIntent.metadata;
      
      // تحديث الكتاب والمستخدم
      const book = await Book.findById(bookId);
      const user = await User.findById(userId);
      const author = await User.findById(book.author);

      // إضافة المستخدم إلى قائمة المشترين
      book.purchases.push(userId);
      await book.save();

      // حساب الأرباح (85% للكاتب، 15% للموقع)
      const authorEarnings = book.price * 0.85;
      author.balance += authorEarnings;
      await author.save();

      res.json({ message: 'تم الشراء بنجاح' });
    } else {
      res.status(400).json({ message: 'فشلت عملية الدفع' });
    }
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في تأكيد عملية الدفع' });
  }
}; 