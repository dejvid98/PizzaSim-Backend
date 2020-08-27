const express = require('express');
const router = express.Router();
const {
  queueOrder,
  cancelOrder,
  getAllOrders,
} = require('../controllers/orderController');

router.route('/').post(queueOrder);
router.route('/delete').post(cancelOrder);
router.route('/').get(getAllOrders);

module.exports = router;
