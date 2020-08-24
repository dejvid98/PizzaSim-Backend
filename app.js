// Libraries imports
const express = require('express');
const cors = require('cors');

// Relative imports
const admin = require('./routes/adminRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.send('Hello World'));
app.use('/admin', admin);

module.exports = app;
