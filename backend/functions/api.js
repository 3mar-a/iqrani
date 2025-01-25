const express = require('express');
const serverless = require('serverless-http');
const app = express();

// ... باقي الكود الخاص بالباك إند

module.exports.handler = serverless(app); 