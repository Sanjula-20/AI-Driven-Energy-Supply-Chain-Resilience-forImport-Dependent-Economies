const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection string in MONGO_URI.
 * Exits the process on failure so the app never runs against a dead DB.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[db] MONGO_URI is not set. Copy .env.example to .env and configure it.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
