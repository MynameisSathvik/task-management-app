const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  { name: 'Wireless Headphones', description: 'High-quality wireless headphones', price: 99.99, category: 'Electronics', image: 'https://via.placeholder.com/300', countInStock: 25, rating: 4.5 },
  { name: 'Running Shoes', description: 'Comfortable running shoes', price: 79.99, category: 'Footwear', image: 'https://via.placeholder.com/300', countInStock: 50, rating: 4.3 },
  { name: 'Coffee Mug', description: 'Ceramic coffee mug', price: 12.5, category: 'Home', image: 'https://via.placeholder.com/300', countInStock: 150, rating: 4.0 },
  { name: 'Smart Watch', description: 'Latest smart watch', price: 199.99, category: 'Electronics', image: 'https://via.placeholder.com/300', countInStock: 10, rating: 4.6 },
  { name: 'Denim Jacket', description: 'Stylish denim jacket', price: 59.99, category: 'Clothing', image: 'https://via.placeholder.com/300', countInStock: 20, rating: 4.2 }
];

const seed = async () => {
  try {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    await Product.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('adminpass', salt);
    const userPass = await bcrypt.hash('userpass', salt);

    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: adminPass, role: 'admin' });
    const user = await User.create({ name: 'Demo User', email: 'user@example.com', password: userPass, role: 'user' });

    for (const p of products) {
      await Product.create(p);
    }

    console.log('Seed data created. Admin: admin@example.com / adminpass, User: user@example.com / userpass');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
