import express from "express";
import { createState, getStates } from "../controller/stateController.js";

const router = express.Router();

// Create a new state
router.post("/", createState);

// Get all states
router.get("/", getStates);

export default router;
