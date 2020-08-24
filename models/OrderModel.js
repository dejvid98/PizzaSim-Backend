const mongoose = require('mongoose');

const orderModel = mongoose.Schema({
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true,
  },
  ingredient: {
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
  ordertime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['queue', 'processing', 'completed'],
    default: 'queue',
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
});

const ingridient = mongoose.model('Order', orderModel);

module.exports = ingridient;
