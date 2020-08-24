const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.send('Hello World'));

module.exports = app;
