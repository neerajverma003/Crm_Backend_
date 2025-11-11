import express from "express";
import EmployeeLead from "../models/employeeLeadModel.js";
// import Lead from "../models/LeadModel.js";
import { createLead, getAllLeads, getLeadsByEmployeeId } from "../controller/employeeLeadController.js";

const router = express.Router();

// 🟢 Assign Lead to Employee
router.post("/",createLead)
router.get("/get",getAllLeads)
router.get("/employee/:employeeId", getLeadsByEmployeeId);
export default router;
