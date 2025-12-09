// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// // Configuration
// dotenv.config();

// // Database
// import pool from "./config/db.js";

// // Middleware
// import { handleUploadErrors } from "./middleware/upload.js";

// // Routes
// import authRoutes from "./routes/auth.js";
// import profileRoutes from "./routes/profile.js";
// import postRoutes from "./routes/posts.js";
// import mediaRoutes from "./routes/medias.js";
// import commentRoutes from "./routes/comments.js";
// import bookRoutes from "./routes/bookRoutes.js";
// import adminBookRoutes from "./routes/adminBookRoutes.js"; // AJOUTER CETTE LIGNE
// import clubRoutes from "./routes/clubs.js";
// import emailRoutes from "./routes/emailRoutes.js";
// import notificationRoutes from "./routes/notifications.js";
// import marketplaceRoutes from "./routes/marketplace.js";
// import eventsRoutes from "./routes/eventRoutes.js";

// import challengesRoutes from "./routes/challenges.js";
// import landingRoutes from "./routes/landing.js";
// import adminRoutes from "./routes/admin.js";
// import adminUsersRoutes from "./routes/adminUsers.js";
// import readingRoutes from "./routes/reading.js";
// import campaignRoutes from "./routes/campaign.js";
// import donationRoutes from "./routes/donationRoutes.js";
// import contactRoutes from "./routes/contact.js";
// import analyticsRoutes from "./routes/analytics.js";
// import moderationRoutes from "./routes/moderation.js";
// // import moderationRoutes from "./routes/moderation.js";
// import reportRoutes from "./routes/reports.js";
// import settingsRoutes from "./routes/settings.js";

// const app = express();

// // Path configuration
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // CORS configuration
// const corsOptions = {
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// };

// app.use(cors(corsOptions));

// // Body parser configuration with extended limits
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// // Static file server
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Database connection test
// const initializeDatabase = async () => {
//   try {
//     await pool.connect();
//     console.log("✅ Connected to PostgreSQL successfully");
//   } catch (err) {
//     console.error("❌ Database connection error:", err);
//     process.exit(1);
//   }
// };

// // API routes organized by domain
// const API_ROUTES = {
//   // Authentication and profile
//   "/api/auth": authRoutes,
//   "/api/profile": profileRoutes,

//   // User content
//   "/api/posts": postRoutes,
//   "/api/comments": commentRoutes,
//   "/api/medias": mediaRoutes,

//   // Library
//   "/api/books": bookRoutes,
//   "/api/admin/books": adminBookRoutes, // AJOUTER CETTE LIGNE

//   // Community
//   "/api/clubs": clubRoutes,
//   "/api/events": eventsRoutes,

//   // Social features
//   "/api/notifications": notificationRoutes,
//   "/api/emails": emailRoutes,

//   // Challenges and badges
//   "/api/challenges": challengesRoutes,

//   // Reading statistics
//   "/api/reading": readingRoutes,

//   // Fundraising
//   "/api/campaigns": campaignRoutes,
//   "/api/donations": donationRoutes,

//   // Marketplace
//   "/api/marketplace": marketplaceRoutes,

//   // Admin
//   "/api/admin": adminRoutes,
//   "/api/admin/users": adminUsersRoutes,

//   // Analytics
//   "/api/admin/analytics": analyticsRoutes,

//   // Moderation
//   "/api/admin/moderation": moderationRoutes,
//   // Signalements utilisateurs
//   "/api/reports": reportRoutes,
  
//   // Modération (déjà présent)
//   // "/api/admin/moderation": moderationRoutes,

//   // Settings
//   "/api/admin/settings": settingsRoutes,

//   // Landing page
//   "/api/landing": landingRoutes,
//   "/api/contact": contactRoutes,
// };

// // Route registration
// Object.entries(API_ROUTES).forEach(([path, route]) => {
//   app.use(path, route);
// });

// // Status and health routes
// app.get("/", (req, res) => {
//   res.json({
//     message: "🚀 Vakio Boky API - Literary Platform",
//     version: "1.0.0",
//     environment: process.env.NODE_ENV || "development",
//     timestamp: new Date().toISOString(),
//     endpoints: Object.keys(API_ROUTES),
//   });
// });

// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK",
//     service: "Vakio Boky API",
//     database: "Connected",
//     environment: process.env.NODE_ENV || "development",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//   });
// });

// // Available endpoints documentation
// app.get("/api/docs", (req, res) => {
//   res.json({
//     message: "Vakio Boky API Endpoints Documentation",
//     endpoints: [
//       { method: "GET", path: "/", description: "API status" },
//       { method: "GET", path: "/api/health", description: "Service health" },
//       { method: "GET", path: "/api/docs", description: "This documentation" },
//       { method: "POST", path: "/api/auth/login", description: "User login" },
//       {
//         method: "POST",
//         path: "/api/auth/register",
//         description: "User registration",
//       },
//       { method: "GET", path: "/api/posts", description: "List of posts" },
//       { method: "POST", path: "/api/posts", description: "Create a post" },
//       { method: "GET", path: "/api/books", description: "Book management" },
//       { method: "GET", path: "/api/admin/books", description: "Admin book management" },
//       {
//         method: "GET",
//         path: "/api/clubs",
//         description: "Reading clubs management",
//       },
//     ],
//   });
// });

// // 404 Middleware - Route not found
// app.use((req, res) => {
//   res.status(404).json({
//     error: "Endpoint not found",
//     path: req.path,
//     method: req.method,
//     available_endpoints: Object.keys(API_ROUTES),
//     documentation: "/api/docs",
//   });
// });

// // Global error handler
// app.use((err, req, res) => {
//   console.error("🔥 Server error:", err);

//   // JWT errors
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       error: "Invalid authentication token",
//       code: "INVALID_TOKEN",
//     });
//   }

//   // Validation errors
//   if (err.name === "ValidationError") {
//     return res.status(400).json({
//       error: "Invalid data",
//       details: err.message,
//     });
//   }

//   // PostgreSQL unique constraint violation
//   if (err.code === "23505") {
//     return res.status(409).json({
//       error: "Data conflict - Resource already exists",
//       code: "DUPLICATE_RESOURCE",
//     });
//   }

//   // Generic error
//   const errorResponse = {
//     error: "Internal server error",
//     code: "INTERNAL_SERVER_ERROR",
//     timestamp: new Date().toISOString(),
//   };

//   // Details in development
//   if (process.env.NODE_ENV === "development") {
//     errorResponse.details = err.message;
//     errorResponse.stack = err.stack;
//   }

//   res.status(500).json(errorResponse);
// });

// // Upload error middleware
// app.use(handleUploadErrors);

// // Server startup
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await initializeDatabase();

//   app.listen(PORT, () => {
//     console.log("\n" + "=".repeat(50));
//     console.log("📚 VAKIO BOKY - API SERVER");
//     console.log("=".repeat(50));
//     console.log(`🚀 Environment: ${process.env.NODE_ENV || "development"}`);
//     console.log(`📍 Port: ${PORT}`);
//     console.log(`🔗 URL: http://localhost:${PORT}`);
//     console.log(`📊 Health: http://localhost:${PORT}/api/health`);
//     console.log(`📁 Files: http://localhost:${PORT}/uploads`);
//     console.log("=".repeat(50) + "\n");
//   });
// };

// // Graceful shutdown handling
// process.on("SIGTERM", async () => {
//   console.log("🛑 Server shutdown in progress...");
//   await pool.end();
//   process.exit(0);
// });

// process.on("SIGINT", async () => {
//   console.log("🛑 Server shutdown (Ctrl+C)...");
//   await pool.end();
//   process.exit(0);
// });

// // Application launch
// startServer().catch(console.error);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Configuration
dotenv.config();

// Database
import pool from "./config/db.js";

// Middleware
import { handleUploadErrors } from "./middleware/upload.js";

// Routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import postRoutes from "./routes/posts.js";
import mediaRoutes from "./routes/medias.js";
import commentRoutes from "./routes/comments.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminBookRoutes from "./routes/adminBookRoutes.js"; // IMPORT ADMIN BOOK ROUTES
import clubRoutes from "./routes/clubs.js";
import emailRoutes from "./routes/emailRoutes.js";
import notificationRoutes from "./routes/notifications.js";
import marketplaceRoutes from "./routes/marketplace.js";
import eventsRoutes from "./routes/eventRoutes.js";
import challengesRoutes from "./routes/challenges.js";
import landingRoutes from "./routes/landing.js";
import adminRoutes from "./routes/admin.js";
import adminUsersRoutes from "./routes/adminUsers.js";
import readingRoutes from "./routes/reading.js";
import campaignRoutes from "./routes/campaign.js";
import donationRoutes from "./routes/donationRoutes.js";
import contactRoutes from "./routes/contact.js";
import analyticsRoutes from "./routes/analytics.js";
import moderationRoutes from "./routes/moderation.js";
import reportRoutes from "./routes/reports.js";
import settingsRoutes from "./routes/settings.js";

const app = express();

// Path configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Body parser configuration with extended limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static file server
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection test
const initializeDatabase = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

// API routes organized by domain
const API_ROUTES = {
  // Authentication and profile
  "/api/auth": authRoutes,
  "/api/profile": profileRoutes,

  // User content
  "/api/posts": postRoutes,
  "/api/comments": commentRoutes,
  "/api/medias": mediaRoutes,

  // Library
  "/api/books": bookRoutes,
  "/api/admin/books": adminBookRoutes, // ADD THIS LINE

  // Community
  "/api/clubs": clubRoutes,
  "/api/events": eventsRoutes,

  // Social features
  "/api/notifications": notificationRoutes,
  "/api/emails": emailRoutes,

  // Challenges and badges
  "/api/challenges": challengesRoutes,

  // Reading statistics
  "/api/reading": readingRoutes,

  // Fundraising
  "/api/campaigns": campaignRoutes,
  "/api/donations": donationRoutes,

  // Marketplace
  "/api/marketplace": marketplaceRoutes,

  // Admin
  "/api/admin": adminRoutes,
  "/api/admin/users": adminUsersRoutes,

  // Analytics
  "/api/admin/analytics": analyticsRoutes,

  // Moderation
  "/api/admin/moderation": moderationRoutes,
  // Signalements utilisateurs
  "/api/reports": reportRoutes,

  // Settings
  "/api/admin/settings": settingsRoutes,

  // Landing page
  "/api/landing": landingRoutes,
  "/api/contact": contactRoutes,
};

// Route registration
Object.entries(API_ROUTES).forEach(([path, route]) => {
  app.use(path, route);
});

// Status and health routes
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Vakio Boky API - Literary Platform",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    endpoints: Object.keys(API_ROUTES),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Vakio Boky API",
    database: "Connected",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Available endpoints documentation
app.get("/api/docs", (req, res) => {
  res.json({
    message: "Vakio Boky API Endpoints Documentation",
    endpoints: [
      { method: "GET", path: "/", description: "API status" },
      { method: "GET", path: "/api/health", description: "Service health" },
      { method: "GET", path: "/api/docs", description: "This documentation" },
      { method: "POST", path: "/api/auth/login", description: "User login" },
      {
        method: "POST",
        path: "/api/auth/register",
        description: "User registration",
      },
      { method: "GET", path: "/api/posts", description: "List of posts" },
      { method: "POST", path: "/api/posts", description: "Create a post" },
      { method: "GET", path: "/api/books", description: "Get all published books" },
      { method: "GET", path: "/api/admin/books", description: "Admin book management" },
      {
        method: "GET",
        path: "/api/clubs",
        description: "Reading clubs management",
      },
    ],
  });
});

// 404 Middleware - Route not found
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
    available_endpoints: Object.keys(API_ROUTES),
    documentation: "/api/docs",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid authentication token",
      code: "INVALID_TOKEN",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Invalid data",
      details: err.message,
    });
  }

  // PostgreSQL unique constraint violation
  if (err.code === "23505") {
    return res.status(409).json({
      error: "Data conflict - Resource already exists",
      code: "DUPLICATE_RESOURCE",
    });
  }

  // Generic error
  const errorResponse = {
    error: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    timestamp: new Date().toISOString(),
  };

  // Details in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
});

// Upload error middleware
app.use(handleUploadErrors);

// Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("📚 VAKIO BOKY - API SERVER");
    console.log("=".repeat(50));
    console.log(`🚀 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`📁 Files: http://localhost:${PORT}/uploads`);
    console.log("=".repeat(50) + "\n");
  });
};

// Graceful shutdown handling
process.on("SIGTERM", async () => {
  console.log("🛑 Server shutdown in progress...");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 Server shutdown (Ctrl+C)...");
  await pool.end();
  process.exit(0);
});

// Application launch
startServer().catch(console.error);