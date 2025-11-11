import { clockIn, clockOut, getAttendanceForAllEmployee ,editAttendance, getAttendanceByEmployeeId  } from '../controller/attendanceController.js';


import express from "express";
const router = express.Router();

router.route("/clockin").post(clockIn);
router.route("/clockout").post(clockOut);
router.route("/getAllAttendance").get(getAttendanceForAllEmployee);
router.route("/:attendanceId").patch(editAttendance)
router.route("/:employeeId").get(getAttendanceByEmployeeId)
export default router;
