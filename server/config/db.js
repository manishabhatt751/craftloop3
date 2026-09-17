const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.log("ℹ️  Database notice: MONGODB_URI not configured in server/.env. Server running with database operations inactive.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("⚠️  MongoDB connection warning:", error.message || error);
    console.warn("Backend will continue running. Verify MONGODB_URI in server/.env when database operations are required.");
  }
};

module.exports = { connectDB };

