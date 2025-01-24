/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('iqrani');

// حذف البيانات القديمة إن وجدت
db.users.drop();
db.books.drop();

// إنشاء حساب الأدمن
db.users.insertOne({
  username: "admin",
  email: "admin@iqrani.com",
  password: "$2b$10$YourHashedPasswordHere", // كلمة المرور: admin123
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

// إنشاء حساب كاتب للتجربة
db.users.insertOne({
  username: "author1",
  email: "author@iqrani.com",
  password: "$2b$10$YourHashedPasswordHere", // كلمة المرور: author123
  role: "author",
  phoneNumber: "123456789",
  bookTypes: ["educational", "cultural"],
  balance: 0,
  createdAt: new Date(),
  updatedAt: new Date()
});

// إنشاء حساب قارئ للتجربة
db.users.insertOne({
  username: "reader1",
  email: "reader@iqrani.com",
  password: "$2b$10$YourHashedPasswordHere", // كلمة المرور: reader123
  role: "reader",
  createdAt: new Date(),
  updatedAt: new Date()
});

// إضافة بعض الكتب للتجربة
db.books.insertMany([
  {
    title: "كتاب تجريبي 1",
    description: "وصف للكتاب التجريبي الأول",
    price: 9.99,
    category: "educational",
    author: db.users.findOne({ email: "author@iqrani.com" })._id,
    coverImage: "https://via.placeholder.com/300",
    pdfFile: "https://example.com/book1.pdf",
    isApproved: true,
    purchases: [],
    ratings: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "كتاب تجريبي 2",
    description: "وصف للكتاب التجريبي الثاني",
    price: 14.99,
    category: "cultural",
    author: db.users.findOne({ email: "author@iqrani.com" })._id,
    coverImage: "https://via.placeholder.com/300",
    pdfFile: "https://example.com/book2.pdf",
    isApproved: false,
    purchases: [],
    ratings: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Run a find command to view items sold on April 4th, 2014.
const salesOnApril4th = db.getCollection('sales').find({
  date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
}).count();

// Print a message to the output window.
console.log(`${salesOnApril4th} sales occurred in 2014.`);

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
db.getCollection('sales').aggregate([
  // Find all of the sales that occurred in 2014.
  { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
  // Group the total sales for each product.
  { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
]);
