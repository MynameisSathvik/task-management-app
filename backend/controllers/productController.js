const Product = require('../models/Product');

exports.listProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, countInStock } = req.body;
    const product = await Product.create({ name, description, price, category, image, countInStock });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    const updates = req.body;
    Object.assign(prod, updates);
    await prod.save();
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    await Product.deleteOne({ _id: prod._id });
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
