// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// // Configuration
// dotenv.config();

// // Database
// import pool from "./config/db.js";

// // Middleware
// import { handleUploadErrors } from "./middleware/upload.js";

// // Routes imports - CORRIGÉ
// import authRoutes from "./routes/auth.js";
// import profileRoutes from "./routes/profile.js";
// import postRoutes from "./routes/posts.js";
// import mediaRoutes from "./routes/medias.js";
// import commentRoutes from "./routes/comments.js";
// import bookRoutes from "./routes/bookRoutes.js";
// import adminBookRoutes from "./routes/adminBookRoutes.js";
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
// import analyticsRoutes from "./routes/adminAnalytics.js";
// import moderationRoutes from "./routes/adminModeration.js";  // ← CORRIGÉ
// import reportRoutes from "./routes/reports.js";
// import settingsRoutes from "./routes/adminSettings.js";  // ← CORRIGÉ

// const app = express();

// // Path configuration
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Créer les dossiers uploads s'ils n'existent pas
// const createUploadsFolders = () => {
//   const folders = [
//     'uploads',
//     'uploads/profiles',
//     'uploads/books',
//     'uploads/posts',
//     'uploads/events',
//     'uploads/campaigns'
//   ];
  
//   folders.forEach(folder => {
//     const folderPath = path.join(__dirname, folder);
//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath, { recursive: true });
//       console.log(`📁 Dossier créé: ${folderPath}`);
//     }
//   });
// };

// createUploadsFolders();

// // CORS configuration
// const corsOptions = {
//   origin: [
//     "https://vakio-boky-frontend.onrender.com",
//     "http://localhost:5173",
//     "http://127.0.0.1:5173",
//     "http://localhost:5174",
//     "http://127.0.0.1:5174"
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// };

// app.use(cors(corsOptions));

// // Body parser configuration with extended limits
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// // Static file server - CORRECTION ICI
// app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
//   setHeaders: (res, filePath) => {
//     // Ajouter des en-têtes de cache pour les images
//     if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
//       res.setHeader('Cache-Control', 'public, max-age=86400'); // 24h cache
//     }
//   }
// }));

// // Middleware pour servir des images par défaut si non trouvées
// app.use((req, res, next) => {
//   if (req.url.startsWith('/uploads/')) {
//     const filePath = path.join(__dirname, req.url);
    
//     // Si le fichier n'existe pas, servir une image par défaut
//     if (!fs.existsSync(filePath)) {
//       console.log(`⚠️ Fichier non trouvé: ${req.url}`);
      
//       // Image par défaut selon le type
//       if (req.url.includes('/profiles/')) {
//         const defaultImage = path.join(__dirname, 'uploads', 'default-profile.png');
//         if (fs.existsSync(defaultImage)) {
//           return res.sendFile(defaultImage);
//         }
//       }
//     }
//   }
//   next();
// });

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

// // API routes organized by domain - CORRIGÉ
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
//   "/api/admin/books": adminBookRoutes,

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

//   // Moderation - CORRIGÉ
//   "/api/admin/moderation": moderationRoutes,
//   "/api/reports": reportRoutes,

//   // Settings - CORRIGÉ
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
//       { method: "GET", path: "/api/books", description: "Get all published books" },
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
// app.use((err, req, res, next) => {
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
//     console.log("📂 Dossiers uploads créés avec succès");
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
import fs from "fs";

dotenv.config();

import pool from "./config/db.js";
import { handleUploadErrors } from "./middleware/upload.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import postRoutes from "./routes/posts.js";
import mediaRoutes from "./routes/medias.js";
import commentRoutes from "./routes/comments.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminBookRoutes from "./routes/adminBookRoutes.js";
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
import analyticsRoutes from "./routes/adminAnalytics.js";
import moderationRoutes from "./routes/adminModeration.js";
import reportRoutes from "./routes/reports.js";
import settingsRoutes from "./routes/adminSettings.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadsFolders = () => {
  const folders = [
    'uploads',
    'uploads/profiles',
    'uploads/books',
    'uploads/posts',
    'uploads/events',
    'uploads/campaigns'
  ];
  
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Dossier créé: ${folderPath}`);
    }
  });
};

createUploadsFolders();

const allowedOrigins = [
  "https://vakio-boky-frontend.onrender.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Origine bloquée par CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Content-Disposition"],
  maxAge: 86400
};

// ✅ CORRECTION : Middleware CORS seulement - PAS de app.options('*', ...)
app.use(cors(corsOptions));

// ❌ NE PAS AJOUTER CETTE LIGNE - C'est elle qui cause l'erreur !
// app.options('*', (req, res) => { ... });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res, filePath, statResult) => {
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || 
        filePath.endsWith('.gif') || filePath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Content-Security-Policy', "default-src 'self' https: data:; img-src 'self' https: data: blob:;");
    }
  }
}));

// Middleware CORS pour les fichiers statiques
app.use("/uploads", (req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  next();
});

app.use((req, res, next) => {
  if (req.url.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, req.url);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Fichier non trouvé: ${req.url}`);
      
      if (req.url.includes('/profiles/')) {
        const defaultImage = path.join(__dirname, 'assets', 'images', 'default-profile.png');
        if (fs.existsSync(defaultImage)) {
          return res.sendFile(defaultImage);
        }
      } else if (req.url.includes('/books/')) {
        const defaultImage = path.join(__dirname, 'assets', 'images', 'default-book.png');
        if (fs.existsSync(defaultImage)) {
          return res.sendFile(defaultImage);
        }
      }
    }
  }
  next();
});

const initializeDatabase = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

const API_ROUTES = {
  "/api/auth": authRoutes,
  "/api/profile": profileRoutes,
  "/api/posts": postRoutes,
  "/api/comments": commentRoutes,
  "/api/medias": mediaRoutes,
  "/api/books": bookRoutes,
  "/api/admin/books": adminBookRoutes,
  "/api/clubs": clubRoutes,
  "/api/events": eventsRoutes,
  "/api/notifications": notificationRoutes,
  "/api/emails": emailRoutes,
  "/api/challenges": challengesRoutes,
  "/api/reading": readingRoutes,
  "/api/campaigns": campaignRoutes,
  "/api/donations": donationRoutes,
  "/api/marketplace": marketplaceRoutes,
  "/api/admin": adminRoutes,
  "/api/admin/users": adminUsersRoutes,
  "/api/admin/analytics": analyticsRoutes,
  "/api/admin/moderation": moderationRoutes,
  "/api/reports": reportRoutes,
  "/api/admin/settings": settingsRoutes,
  "/api/landing": landingRoutes,
  "/api/contact": contactRoutes,
};

Object.entries(API_ROUTES).forEach(([path, route]) => {
  app.use(path, route);
});

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

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
    available_endpoints: Object.keys(API_ROUTES),
    documentation: "/api/docs",
  });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid authentication token",
      code: "INVALID_TOKEN",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Invalid data",
      details: err.message,
    });
  }

  if (err.code === "23505") {
    return res.status(409).json({
      error: "Data conflict - Resource already exists",
      code: "DUPLICATE_RESOURCE",
    });
  }

  const errorResponse = {
    error: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
});

app.use(handleUploadErrors);

// Keep-alive pour Render Free
const keepAlive = () => {
  setInterval(async () => {
    try {
      await pool.query('SELECT 1');
      console.log('💓 Keep-alive ping - Backend actif');
    } catch (error) {
      console.error('❌ Keep-alive échoué:', error.message);
    }
  }, 4 * 60 * 1000);
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initializeDatabase();
  
  keepAlive();

  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("📚 VAKIO BOKY - API SERVER");
    console.log("=".repeat(50));
    console.log(`🚀 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`🔗 Production URL: ${process.env.BACKEND_URL || 'Non configuré'}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`📁 Files: http://localhost:${PORT}/uploads`);
    console.log("📂 Dossiers uploads créés avec succès");
    console.log("=".repeat(50) + "\n");
  });
};

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

startServer().catch(console.error);