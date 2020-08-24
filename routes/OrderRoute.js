const express = require('express');
const router = express.Router();
const { queueOrder, create } = require('../controllers/orderController');

router.route('/queue').post(queueOrder);
router.route('/create').post(create);

module.exports = router;
