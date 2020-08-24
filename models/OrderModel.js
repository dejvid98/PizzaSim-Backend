const mongoose = require('mongoose');

const orderModel = mongoose.Schema({
  pizzaSize: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    required: true,
  },
  ingridient: {
    type: String,
    enum: [
      'cheese',
      'tomato sauce',
      'pepperoni',
      'mushrooms',
      'onions',
      'pineapple',
      'bacon',
      'olives',
    ],
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
});

const ingridient = mongoose.model('Ingridient', orderModel);

module.exports = ingridient;
