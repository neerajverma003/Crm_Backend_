import express from "express";
import { AddEmployee, getAllEmployee, deleteEmployee, editEmployee ,getEmployee, getMyLeaves, applyLeave, getAssignedRoles } from "../controller/employeeController.js";
import { editAdmin } from "../controller/adminController.js";

const router = express.Router();

// Add new employee
router.route("/addEmployee").post(AddEmployee);

// Get all employees
router.route("/allEmployee").get(getAllEmployee);

// Delete employee by ID
// router.route("/deleteEmployee/:employeeId").delete(deleteEmployee);
router.delete("/deleteEmployee/:employeeId",  deleteEmployee);

router.get("/getAssignedRoles/:employeeId", getAssignedRoles);
//edit employee by ID
router.route("/editEmployee/:employeeId").put(editEmployee);


router.route("/getEmployee/:empId").get(getEmployee);

router.post("/apply", applyLeave);
router.get("/my-leaves/:employeeId", getMyLeaves);
export default router;
