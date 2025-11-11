// import { loginUser } from "../controller/authController.js";
import express from "express";
import { createRole, getAllRole } from "../controller/roleController.js";
const router = express.Router();    
router.post("/role", createRole);
router.get("/getrole", getAllRole)

export default router;  