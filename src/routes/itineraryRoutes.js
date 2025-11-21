import express from "express";
import multer from "multer";
import {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
} from "../controller/itineraryController.js";

const router = express.Router();

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create itinerary (multiple PDFs)
router.post("/create", upload.array("Upload"), createItinerary); // note `array` instead of `single`

// CRUD routes
router.get("/", getAllItineraries);
router.get("/:id", getItineraryById);
router.put("/:id", updateItinerary);
router.delete("/:id", deleteItinerary);

export default router;
