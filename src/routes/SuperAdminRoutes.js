import express from "express";
import { addSuperAdmin, getSuperAdminById } from "../controller/superAdminController.js";

const router = express.Router();

router.post("/", addSuperAdmin);
router.get("/super/:id",getSuperAdminById)

export default router;
