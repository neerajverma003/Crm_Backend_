// routes/assignLeadRoutes.js
import express from "express";
import { assignLeadToEmployee } from "../controller/assignLeadController.js";

const router = express.Router();

// POST /assign-lead
router.post("/", assignLeadToEmployee);

export default router;
