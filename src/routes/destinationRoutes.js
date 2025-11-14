import express from "express";
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  deleteDestination,
  updateDestination,
} from "../controller/destinationController.js";

const router = express.Router();

router.post("/", createDestination);
router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);
router.delete("/:id", deleteDestination);
router.put("/:id", updateDestination); // optional

export default router;
