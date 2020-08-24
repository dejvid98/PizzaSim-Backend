const orderModel = require('../models/OrderModel');
const ingredientModel = require('../models/IngredientModel');
const io = require('../socket');

let isbusy = false;
let orders = [];
let queueTime = 0;
let orderTime;

const updateQueue = async () => {
  // Retrieves all orders that are either in queue or processing
  // and updates the state with them
  orders = [
    ...(await orderModel.find({
      $or: [{ status: 'queue' }, { status: 'processing' }],
    })),
  ];

  // Calculates how much time has passed since the chef has started working
  // on the order and substracts it from total queue time
  const timeDifference = new Date().getSeconds() - orderTime;
  queueTime = orders.reduce((acc, curr) => acc + curr.time, 0) - timeDifference;

  // Emits a message to the client with updated state of queue time/place
  const socket = io.getIO();
  socket.emit('orders', {
    orders: orders.length,
    queueTime,
  });
};

const handleQueue = async () => {
  if (isbusy) return;
  // Updates the current order status' to processing and sets state to busy
  const nextOrder = await orderModel
    .findOneAndUpdate({ status: 'queue' }, { status: 'processing' })
    .sort({ ordertime: 'asc' });

  // If there arent any orders in queue it stops
  if (!nextOrder) return;
  isbusy = true;
  orderTime = new Date().getSeconds();

  // After the order is completed depending on the time,
  // updates its status to completed and sets the state to not busy
  setTimeout(async () => {
    await orderModel.findOneAndUpdate(
      { _id: nextOrder._id },
      { status: 'completed' }
    );
    updateQueue();
    isbusy = false;
    handleQueue();
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
    const ordersInQueue = await orderModel.find({
      $or: [{ status: 'queue' }, { status: 'processing' }],
    });

    // Calculates remaning time for all of the orders in queue
    const queueTime = ordersInQueue.reduce((acc, curr) => acc + curr.time, 0);

    if (ordersInQueue.length >= 15)
      return res.send('Sorry, the restaurant is busy');

    // Increases price and time according to size
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
        totalTime += 3;
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

    handleQueue();

    res.send({
      message: 'Order successfully placed in a queue',
      queueTime: queueTime + totalTime,
      ordersLeft: ordersInQueue.length + 1,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;

    await orderModel.findByIdAndDelete(id);

    updateQueue();

    res.send({ message: 'Order successfully cancled' });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ status: 'completed' });

    res.send({ data: orders });
  } catch (err) {
    console.log(err);
  }
};
