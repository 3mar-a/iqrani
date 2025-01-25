const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../app');

// اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات'))
  .catch(err => console.error('خطأ في الاتصال:', err));

// تصدير التطبيق كدالة serverless
module.exports.handler = serverless(app); 