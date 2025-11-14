import express from "express";
import {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
} from "../controller/transportController.js";

const router = express.Router();

// ------------------ ROUTES ------------------

// Create a new transport
router.post("/", createTransport);

// Get all transports
router.get("/", getTransports);

// Get a single transport by ID
router.get("/:id", getTransportById);

// Update a transport by ID
router.put("/:id", updateTransport);

// Delete a transport by ID
router.delete("/:id", deleteTransport);

export default router;
