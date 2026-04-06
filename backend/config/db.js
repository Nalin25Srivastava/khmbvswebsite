require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error!`);
    console.error(`Error Message: ${error.message}`);
  }
};

module.exports = connectDB;
