import express from "express";
import {
  clockIn,
  clockOut,
  editAdminAttendance,
  getAdminAttendanceById,
  getAllAdminAttendance
} from "../controller/adminAttendanceController.js";

const router = express.Router();

router.post("/clockin", clockIn);
router.post("/clockout", clockOut);
router.get("/getAllAttendance", getAllAdminAttendance);
router.get("/:adminId", getAdminAttendanceById);
router.put("/editAttendance/:id", editAdminAttendance);
export default router;