const mongoose = require("mongoose");

let memoryServerInstance = null;
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      if (!memoryServerInstance) {
        memoryServerInstance = await MongoMemoryServer.create({ spawn: { timeout: 120000 } });
      }
      uri = memoryServerInstance.getUri();
      console.log(`✅ Using In-Memory MongoDB at: ${uri}`);
    } catch (err) {
      console.warn("⚠️  Could not start in-memory MongoDB:", err.message);
    }
  }

  if (!uri) {
    console.log("ℹ️  Database notice: MONGODB_URI not configured in server/.env. Server running with database operations inactive.");
    return;
  }

    try {
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn("⚠️  MongoDB connection warning:", error.message || error);
      console.warn("Backend will continue running. Verify MONGODB_URI in server/.env when database operations are required.");
    }
  })();

  return connectionPromise;
};

module.exports = { connectDB };
