const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['reader', 'author', 'admin'],
    default: 'reader'
  },
  phoneNumber: {
    type: String,
    required: function() {
      return this.role === 'author';
    }
  },
  phoneArea: {
    type: String,
    required: function() {
      return this.role === 'author';
    }
  },
  bookTypes: [{
    type: String,
    enum: ['educational', 'historical', 'cultural', 'novel'],
    required: function() {
      return this.role === 'author';
    }
  }],
  profileImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 