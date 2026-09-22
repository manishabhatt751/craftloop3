const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from server/.env
dotenv.config({
  path: path.join(__dirname, ".env"),
});

const http = require("http");
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const apiRoutes = require("./routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorHandler");
const { initSocket } = require("./socket");
const { seedDataIfEmpty } = require("./config/seedData");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Serve uploaded media statically (profile photos, project images, course thumbnails, videos up to 5 GB)
const fs = require("fs");
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// ===============================
// Base Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "CraftLoop Backend is running!",
    apiDocs: "/api",
  });
});

// ===============================
// API Routes
// ===============================

app.use("/api", apiRoutes);

// ===============================
// Error Handling
// ===============================

app.use(notFoundHandler);
app.use(errorHandler);

// ===============================
// Server Configuration
// ===============================

const PORT = process.env.PORT || 5000;

// ===============================
// Start Server
// ===============================

if (require.main === module) {
  // Handle unexpected errors
  process.on("unhandledRejection", (reason) => {
    console.error(
      "Unhandled Rejection:",
      reason?.message || reason
    );
  });

  process.on("uncaughtException", (err) => {
    console.error(
      "Uncaught Exception:",
      err?.message || err
    );
  });

  console.log("=================================");
  console.log("Starting CraftLoop Backend...");
  console.log("=================================");

  // Check environment variable
  console.log(
    "MONGODB_URI:",
    process.env.MONGODB_URI ? "LOADED" : "MISSING"
  );

  console.log(
    "PORT:",
    process.env.PORT || 5000
  );

  // Connect to MongoDB first
  connectDB()
    .then(async () => {
      console.log("MongoDB connection successful.");

      // Seed initial data if required
      try {
        await seedDataIfEmpty();
        console.log("Seed data check completed.");
      } catch (seedError) {
        console.error(
          "Seed data error:",
          seedError.message
        );
      }

      // Start HTTP server only after DB connection succeeds
      server.listen(PORT, () => {
        console.log("=================================");
        console.log(`CraftLoop Backend running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
        console.log("MongoDB: Connected");
        console.log("=================================");
      });
    })
    .catch((err) => {
      console.error("=================================");
      console.error("DATABASE CONNECTION FAILED");
      console.error("=================================");
      console.error(err.message);

      console.error(
        "Backend will NOT start because MongoDB connection failed."
      );

      process.exit(1);
    });
}

// Export app and server
module.exports = app;
module.exports.server = server;