import express from "express";
import {
  createDestination,
  getAllDestinations,
  deleteDestination,
  assignDestination,
} from "../controller/employeeDestinationnController.js";

const router = express.Router();

// CREATE
router.post("/", createDestination);

// GET ALL
router.get("/", getAllDestinations);

// DELETE
router.delete("/:id", deleteDestination);
router.post("/assign-destination", assignDestination);


export default router;
