const mongoose = require('mongoose');

const ingridientModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const ingridient = mongoose.model('Ingridient', ingridientModel);

module.exports = ingridient;
