const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Import configurations
const config = require("./config/default");
const { connectDB } = require("./config/database");

// Import middleware
const {
  notFound,
  errorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
} = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medications");
const alertRoutes = require("./routes/alerts");
const reportRoutes = require("./routes/reports");
const discussionRoutes = require("./routes/discussions");
const locationRoutes = require("./routes/locations");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Handle unhandled promise rejections
process.on("unhandledRejection", handleUnhandledRejection);

// Handle uncaught exceptions
process.on("uncaughtException", handleUncaughtException);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware

app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedAlert API is running",
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    version: "1.0.0",
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "MedAlert API Documentation",
    version: "1.0.0",
    endpoints: {
      auth: {
        base: "/api/auth",
        routes: [
          "POST /register - Register a new user",
          "POST /login - Login user",
          "POST /logout - Logout user",
          "GET /me - Get current user profile",
          "PUT /update-profile - Update user profile",
          "PUT /change-password - Change user password",
          "POST /refresh - Refresh JWT token",
          "DELETE /delete-account - Delete user account",
        ],
      },
      medications: {
        base: "/api/medications",
        routes: [
          "GET / - Get all medications",
          "POST / - Add new medication",
          "GET /search - Search medications",
          "PUT /bulk - Bulk update medications",
          "GET /:id - Get specific medication",
          "PUT /:id - Update medication",
          "DELETE /:id - Delete medication",
          "GET /:id/stats - Get medication statistics",
        ],
      },
      alerts: {
        base: "/api/alerts",
        routes: [
          "GET / - Get all alerts",
          "POST / - Create new alert",
          "GET /stats - Get alert statistics",
          "GET /upcoming - Get upcoming alerts",
          "PUT /bulk - Bulk update alerts",
          "PUT /:id - Update alert",
          "DELETE /:id - Delete alert",
          "POST /:id/mark-taken - Mark medication as taken",
          "POST /:id/snooze - Snooze alert",
        ],
      },
      reports: {
        base: "/api/reports",
        routes: [
          "GET / - Get all reports",
          "POST / - Create new report",
          "GET /summary - Get adherence summary",
          "GET /chart - Get chart data",
          "GET /export - Export reports",
          "GET /:id - Get specific report",
          "PUT /:id - Update report",
          "DELETE /:id - Delete report",
        ],
      },
      discussions: {
        base: "/api/discussions",
        routes: [
          "GET / - Get all discussions",
          "POST / - Create new discussion",
          "GET /search - Search discussions",
          "GET /popular - Get popular discussions",
          "GET /:id - Get specific discussion",
          "PUT /:id - Update discussion",
          "DELETE /:id - Delete discussion",
          "POST /:id/like - Like/unlike discussion",
          "POST /:id/replies - Add reply",
          "POST /:id/replies/:replyId/solution - Mark reply as solution",
        ],
      },
      locations: {
        base: "/api/locations",
        routes: [
          "GET / - Get all locations",
          "POST / - Add new location",
          "GET /nearby - Get nearby locations",
          "GET /search - Search locations",
          "GET /favorites - Get favorite locations",
          "GET /:id - Get specific location",
          "PUT /:id - Update location",
          "DELETE /:id - Delete location",
          "POST /:id/favorite - Toggle favorite",
          "POST /:id/review - Add review",
        ],
      },
    },
    authentication: {
      type: "JWT Bearer Token",
      header: "Authorization: Bearer <token>",
    },
    status: "active",
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/locations", locationRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  console.log(`🚀 MedAlert API server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.server.env}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
});

module.exports = app;
