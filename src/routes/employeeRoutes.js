import express from "express";
import { AddEmployee, getAllEmployee, deleteEmployee, editEmployee ,getEmployee, getMyLeaves, applyLeave, getAssignedRoles, assignCompany, assignWorkRole,  getCompanyByEmployeeId, getDepartments,  getSubRoleName } from "../controller/employeeController.js";
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
router.get("/getCompanyByEmployeeId/:employeeId", getCompanyByEmployeeId);
router.post("/assignRole", assignWorkRole);
router.route("/getEmployee/:empId").get(getEmployee);
router.post("/assign", assignCompany);
router.post("/apply", applyLeave);
router.get("/departments", getDepartments);
// router.get("/getSubRoleName/:subRoleId", getSubRoleName);
router.get("/getSubRoleName/:subRoleId", getSubRoleName);
router.get("/my-leaves/:employeeId", getMyLeaves);
export default router;
