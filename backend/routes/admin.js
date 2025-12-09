// // import express from "express";
// // import { authenticateToken } from "../middleware/auth.js";
// // import {
// //   getAllUsers,
// //   promoteUser,
// //   blockUser,
// //   getUserStats,
// //   getUserAnalytics,
// //   getRoles,
// //   createRole,
// //   updateRole,
// //   deleteRole,
// //   getPermissions,
// //   bulkUserAction,
// // } from "../controllers/adminController.js";

// // const router = express.Router();

// // // All admin routes require authentication
// // router.use(authenticateToken);

// // // User management
// // router.get("/users", getAllUsers);
// // router.put("/users/:userId/promote", promoteUser);
// // router.put("/users/:userId/block", blockUser);
// // router.post("/users/bulk-action", bulkUserAction);

// // // User analytics
// // router.get("/users/analytics", getUserAnalytics);

// // // User statistics
// // router.get("/stats", getUserStats);

// // // Role management
// // router.get("/roles", getRoles);
// // router.post("/roles", createRole);
// // router.put("/roles/:id", updateRole);
// // router.delete("/roles/:id", deleteRole);

// // // Permissions
// // router.get("/permissions", getPermissions);

// // export default router;
// import express from "express";
// import { authenticateToken } from "../middleware/auth.js";
// import { getDashboardStats, getRecentActivity } from "../controllers/adminController.js";

// const router = express.Router();

// // Routes pour le tableau de bord admin
// router.get("/dashboard/stats", authenticateToken, getDashboardStats);
// router.get("/dashboard/activity", authenticateToken, getRecentActivity);

// export default router;
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getDashboardStats, getRecentActivity } from "../controllers/adminController.js";

const router = express.Router();

// Routes protégées pour l'admin
router.get("/dashboard/stats", authenticateToken, getDashboardStats);
router.get("/dashboard/activity", authenticateToken, getRecentActivity);

export default router;