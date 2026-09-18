const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({
    message: "CraftLoop Backend is running!",
    apiDocs: "/api"
  });
});

// Modular API Routes
app.use("/api", apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`CraftLoop Backend running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.server = server;