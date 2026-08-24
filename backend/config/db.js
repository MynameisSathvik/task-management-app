const mongoose = require('mongoose');

// Connect to MongoDB. In production we require MONGODB_URI to be set and reachable.
const connectDB = async (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    if (process.env.NODE_ENV === 'production') {
      console.error('MONGODB_URI is required in production');
      process.exit(1);
    }
    console.warn('MONGODB_URI not set; development mode will use in-memory MongoDB fallback');
  }

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      if (process.env.NODE_ENV === 'production') {
        console.error('Cannot connect to MongoDB in production. Exiting.');
        process.exit(1);
      }
      console.warn('Falling back to in-memory MongoDB for development/testing');
    }
  }

  // Fallback to in-memory MongoDB (only in non-production)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const uri2 = mongod.getUri();
    await mongoose.connect(uri2, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to in-memory MongoDB');
    module.exports.mongod = mongod;
  } catch (err) {
    console.error('Failed to start in-memory MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
