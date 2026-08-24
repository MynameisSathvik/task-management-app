const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    // Validate stock and calculate total
    let total = 0;
    const itemsToSave = [];
    for (const item of orderItems) {
      // support item.product being an id string or an object with _id
      const productId = item.product && (typeof item.product === 'string' ? item.product : (item.product._id || item.product.id || item.product));
      if (!productId) return res.status(400).json({ message: `Product ${item.name} not found` });
      const product = await Product.findById(productId);
      if (!product) return res.status(400).json({ message: `Product ${item.name || productId} not found` });
      if (product.countInStock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      // Use product.price to prevent client price manipulation
      total += product.price * item.qty;
      // prepare item to save
      itemsToSave.push({ product: product._id, name: product.name, price: product.price, qty: item.qty });
      // reduce stock
      product.countInStock -= item.qty;
      await product.save();
    }
    const order = await Order.create({ user: req.user._id, orderItems: itemsToSave, shippingInfo, totalPrice: total });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product').populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only owner or admin
    if (String(order.user._id) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('orderItems.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status } = req.body;
    if (status) order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
