const mongoose = require('mongoose');

const adminModel = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const admin = mongoose.model('Admin', adminModel);

module.exports = admin;
