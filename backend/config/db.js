const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log(`⚠️ Starting in-memory MongoDB for development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-memory MongoDB connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`❌ In-memory MongoDB failed: ${memErr.message}`);
    }
  }
};

module.exports = connectDB;
