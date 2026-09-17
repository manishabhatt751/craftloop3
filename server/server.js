const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Connect to Neon PostgreSQL
connectDB();

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

app.listen(PORT, () => {
  console.log(`CraftLoop Backend running on port ${PORT}`);
});

module.exports = app;