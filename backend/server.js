const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
const clientOrigin = process.env.CLIENT_URL || '*';
app.use(cors({ origin: clientOrigin }));

(async () => {
  // Connect DB and then seed sample data if missing
  await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

  // Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/users', require('./routes/users'));

  app.get('/', (req, res) => res.json({ message: 'E-Commerce API running' }));

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
  });

  // Seed minimal data if DB empty (products/users)
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      console.log('Seeding default products...');
      const products = [
        { name: 'Wireless Headphones', description: 'High-quality wireless headphones', price: 99.99, category: 'Electronics', image: 'https://via.placeholder.com/300', countInStock: 25, rating: 4.5 },
        { name: 'Running Shoes', description: 'Comfortable running shoes', price: 79.99, category: 'Footwear', image: 'https://via.placeholder.com/300', countInStock: 50, rating: 4.3 },
        { name: 'Coffee Mug', description: 'Ceramic coffee mug', price: 12.5, category: 'Home', image: 'https://via.placeholder.com/300', countInStock: 150, rating: 4.0 },
        { name: 'Smart Watch', description: 'Latest smart watch', price: 199.99, category: 'Electronics', image: 'https://via.placeholder.com/300', countInStock: 10, rating: 4.6 },
        { name: 'Denim Jacket', description: 'Stylish denim jacket', price: 59.99, category: 'Clothing', image: 'https://via.placeholder.com/300', countInStock: 20, rating: 4.2 }
      ];
      await Product.insertMany(products);
      console.log('Products seeded');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default users...');
      const salt = await bcrypt.genSalt(10);
      const adminPass = await bcrypt.hash('adminpass', salt);
      const userPass = await bcrypt.hash('userpass', salt);
      await User.create({ name: 'Admin', email: 'admin@example.com', password: adminPass, role: 'admin' });
      await User.create({ name: 'Demo User', email: 'user@example.com', password: userPass, role: 'user' });
      console.log('Users seeded (admin@example.com / adminpass, user@example.com / userpass)');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
