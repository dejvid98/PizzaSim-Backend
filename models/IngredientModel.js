const mongoose = require('mongoose');

const ingredientModel = mongoose.Schema({
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

const ingredient = mongoose.model('Ingredient', ingredientModel);

module.exports = ingredient;
