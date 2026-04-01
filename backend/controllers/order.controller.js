const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentIntentId } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const subtotal = items.reduce((sum, i) => sum + i.priceAtPurchase * i.qty, 0);
    const shippingCost = subtotal > 200 ? 0 : 15;
    const total = subtotal + shippingCost;

    const orderData = {
      items,
      shippingAddress,
      paymentIntentId,
      status: 'paid',
      subtotal,
      shippingCost,
      total,
    };
    if (req.user) {
      orderData.user = req.user._id;
    }

    const order = await Order.create(orderData);

    // Clear the user's cart after order if logged in
    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    res.status(201).json({ order });
  } catch (err) { next(err); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ orders });
  } catch (err) { next(err); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) { next(err); }
};

module.exports = { createOrder, getMyOrders, getOrderById };
