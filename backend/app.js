const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/.netlify/functions/api/auth', require('./routes/authRoutes'));
app.use('/.netlify/functions/api/books', require('./routes/bookRoutes'));
app.use('/.netlify/functions/api/admin', require('./routes/adminRoutes'));
app.use('/.netlify/functions/api/author', require('./routes/authorRoutes'));
app.use('/.netlify/functions/api/reader', require('./routes/readerRoutes'));

module.exports = app; 