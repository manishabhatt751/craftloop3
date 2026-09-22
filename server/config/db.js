const mongoose = require("mongoose");

let connectionPromise = null;
let isReconnecting = false;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Connection already in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  // No MongoDB URI
  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Please add your MongoDB Atlas connection string to server/.env"
    );
  }

  connectionPromise = (async () => {
    try {
      console.log("Connecting to MongoDB...");

      const conn = await mongoose.connect(uri, {
        dbName: "craftloop",
        serverSelectionTimeoutMS: 10000,
      });

      console.log("\n=================================");
      console.log("MongoDB connected successfully");
      console.log(`Database: ${conn.connection.name}`);
      console.log(`Host: ${conn.connection.host}`);
      console.log(`ReadyState: ${conn.connection.readyState}`);
      console.log("=================================\n");

      connectionPromise = null;

      return conn;
    } catch (error) {
      connectionPromise = null;

      console.error("\n=================================");
      console.error("MongoDB CONNECTION FAILED");
      console.error("=================================");
      console.error(error.message);
      console.error("=================================\n");

      // Important:
      // Re-throw the error so server.js knows
      // that MongoDB connection failed.
      throw error;
    }
  })();

  return connectionPromise;
};

// ========================================
// MongoDB connection events
// ========================================

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

let hasSuccessfullyConnected = false;

// ========================================
// Auto reconnect (only after initial successful connection)
// ========================================

mongoose.connection.on("connected", () => {
  hasSuccessfullyConnected = true;
});

mongoose.connection.on("disconnected", () => {
  if (!hasSuccessfullyConnected || isReconnecting) {
    return;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    return;
  }

  isReconnecting = true;
  console.log("Attempting MongoDB reconnection in 3 seconds...");

  setTimeout(async () => {
    try {
      await connectDB();
      console.log("MongoDB reconnected successfully.");
    } catch (error) {
      console.error("MongoDB reconnection failed:", error.message);
    } finally {
      isReconnecting = false;
    }
  }, 3000);
});


module.exports = {
  connectDB,
};