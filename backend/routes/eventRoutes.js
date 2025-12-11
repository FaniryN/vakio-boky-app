// // // import express from "express";
// // // import {
// // //   getEvents,
// // //   createEvent,
// // //   getEventById,
// // //   updateEvent,
// // //   deleteEvent,
// // //   registerForEvent,
// // //   getEventRegistrations,
// // //   getDetailById,
// // // } from "../controllers/evenementController.js";

// // // const router = express.Router();

// // // router.get("/", getEvents);
// // // router.post("/", createEvent);
// // // router.get("/:id", getEventById);
// // // router.put("/:id", updateEvent);
// // // router.delete("/:id", deleteEvent);
// // // router.post("/:id/register", registerForEvent);
// // // router.get("/:id/registrations", getEventRegistrations);
// // // router.get("/:id/detail", getDetailById);


// // // export default router;
// // import express from "express";
// // import {
// //   getEvents,
// //   createEvent,
// //   getEventById,
// //   updateEvent,
// //   deleteEvent,
// //   registerForEvent,
// //   getEventRegistrations,
// //   getDetailById,
// //   getAdminEvents,
// //   approveEvent,
// //   rejectEvent,
// //   featureEvent,
// //   getEventAnalytics
// // } from "../controllers/evenementController.js";

// // const router = express.Router();

// // // Routes publiques
// // router.get("/", getEvents);
// // router.post("/", createEvent);
// // router.get("/:id", getEventById);
// // router.put("/:id", updateEvent);
// // router.delete("/:id", deleteEvent);
// // router.post("/:id/register", registerForEvent);
// // router.get("/:id/registrations", getEventRegistrations);
// // router.get("/:id/detail", getDetailById);

// // // Routes d'administration
// // router.get("/admin/events", getAdminEvents);
// // router.put("/admin/:id/approve", approveEvent);
// // router.put("/admin/:id/reject", rejectEvent);
// // router.put("/admin/:id/feature", featureEvent);
// // router.get("/admin/analytics", getEventAnalytics);

// // export default router;
// import express from "express";
// import {
//   getEvents,
//   createEvent,
//   getEventById,
//   updateEvent,
//   deleteEvent,
//   registerForEvent,
//   getEventRegistrations,
//   getDetailById,
//   getAdminEvents,
//   approveEvent,
//   rejectEvent,
//   featureEvent,
//   getEventAnalytics
// } from "../controllers/evenementController.js";

// const router = express.Router();

// // Routes publiques
// router.get("/", getEvents);
// router.post("/", createEvent);
// router.get("/:id", getEventById);
// router.put("/:id", updateEvent);
// router.delete("/:id", deleteEvent);
// router.post("/:id/register", registerForEvent);
// router.get("/:id/registrations", getEventRegistrations);
// router.get("/:id/detail", getDetailById);

// // Routes d'administration
// router.get("/admin/events", getAdminEvents);
// router.put("/admin/:id/approve", approveEvent);
// router.put("/admin/:id/reject", rejectEvent);
// router.put("/admin/:id/feature", featureEvent);
// router.get("/admin/analytics", getEventAnalytics);

// export default router;
import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  getDetailById,
  getAllEventsAdmin,  // Changé de getAdminEvents à getAllEventsAdmin
  approveEvent,
  rejectEvent,
  featureEvent,
  getEventAnalytics,
  getFeaturedEvents  // Ajouté si vous avez besoin de cette route
} from "../controllers/evenementController.js";

const router = express.Router();

// Routes publiques
router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/register", registerForEvent);
router.get("/:id/registrations", getEventRegistrations);
router.get("/detail/:id", getDetailById);  // Correction: le paramètre doit être dans l'URL

// Routes d'administration
router.get("/admin/all", getAllEventsAdmin);  // Changé de /admin/events à /admin/all
router.put("/admin/:id/approve", approveEvent);
router.put("/admin/:id/reject", rejectEvent);
router.put("/admin/:id/feature", featureEvent);
router.get("/admin/analytics", getEventAnalytics);

// Route pour les événements en avant (optionnelle)
router.get("/featured", getFeaturedEvents);

export default router;