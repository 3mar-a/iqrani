// تخزين البيانات في الذاكرة
const db = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@iqrani.com',
      password: '$2a$10$rPIuHhqwXF0LQrNqFRBYpOYHtYS3BOe4k5gT1aQXF8c8Y9LnS1Aqe', // admin123
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  books: [],
  purchases: [],
  earnings: {
    site: 0,
    authors: {}
  }
};

module.exports = db; 