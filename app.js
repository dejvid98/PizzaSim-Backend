// Libraries imports
const express = require('express');
const cors = require('cors');

// Relative imports
const admin = require('./routes/adminRoute');
const order = require('./routes/OrderRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: true }));

app.use('/admin', admin);
app.use('/order', order);

module.exports = app;
