const orderModel = require('../models/OrderModel');
const ingredientModel = require('../models/IngredientModel');

let queueTime = 0;
const orders = [];
let isbusy = false;

const handleQueue = async () => {
  if (isbusy) return;

  // Retrieves all of the orders from db that are waiting in queue
  orders = [
    ...(await orderModel.find({ status: 'queue' }).sort({ ordertime: 'asc' })),
  ];

  const nextOrder = orders[0];

  // If there arent any orders waiting it stops
  if (!nextOrder) return;

  // Updates the current order status' to processing and sets state to busy
  await orderModel.findOneAndUpdate(
    { _id: nextOrder._id },
    { status: 'processing' }
  );

  isbusy = true;

  // Calculates remaning time for all of the orders in queue
  queueTime = orders.reduce((acc, curr) => acc + curr);

  // After the order is completed depending on the time,
  // updates its status to completed and sets the state to not busy
  setTimeout(async () => {
    await orderModel.findOneAndUpdate(
      { _id: nextOrder._id },
      { status: 'completed' }
    );
    isbusy = false;
  }, nextOrder.time * 1000);
};

exports.queueOrder = async (req, res) => {
  try {
    const {
      size,
      ingredient,
      firstname,
      lastname,
      address,
      phonenumber,
    } = req.body;

    let totalPrice = 0;
    let totalTime = 0;
    const ordersInQueue = await orderModel.find({ status: 'queue' });

    if (ordersInQueue.length >= 15)
      return res.send('Sorry, the restaurant is busy');

    switch (size) {
      case 'small':
        totalPrice += 200;
        totalTime += 1;
        break;
      case 'medium':
        totalPrice += 400;
        totalTime += 2;
        break;
      case 'large':
        totalPrice += 600;
        totalTime + 3;
        break;
    }

    const ingredientDetails = await ingredientModel.findOne({
      name: ingredient,
    });

    totalPrice += ingredientDetails.price;
    totalTime += ingredientDetails.time;

    const order = new orderModel({
      size,
      ingredient,
      firstname,
      lastname,
      address,
      phonenumber,
      time: totalTime,
      price: totalPrice,
    });

    await order.save();

    res.send({
      message: 'Order successfully placed in a queue',
      queueTime: queueTime + totalTime,
      ordersLeft: ordersLeft.length + 1,
    });
  } catch (err) {
    console.log(err);
  }
};

