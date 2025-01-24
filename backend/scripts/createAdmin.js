const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminData = {
      email: 'admin@iqrani.com',
      password: await bcrypt.hash('AdminPassword123', 12),
      username: 'admin',
      role: 'admin'
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('تم إنشاء حساب الأدمن بنجاح');
    process.exit(0);
  } catch (error) {
    console.error('حدث خطأ:', error);
    process.exit(1);
  }
};

createAdmin(); 