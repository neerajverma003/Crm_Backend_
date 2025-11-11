import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import Leave from "../models/LeaveModel.js";

/* ===========================
      ADD EMPLOYEE
=========================== */
export const AddEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      department,
      company,
      role,
      accountActive = true,
      officialNo,
      emergencyNo
    } = req.body;

    // --- Validation ---
    if (!fullName || !email || !phone || !department || !password || !officialNo || !emergencyNo) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ success: false, message: "Invalid company ID" });
    }

    const existingUser = await Employee.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Employee already exists with this email or phone number",
      });
    }

    // --- Hash Password ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create Employee ---
    const newUser = new Employee({
      fullName,
      email,
      phone,
      department,
      company,
      role: role || "Employee",
      password: hashedPassword,
      officialNo,
      emergencyNo,
      accountActive,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        company: newUser.company,
        department: newUser.department,
        role: newUser.role,
        officialNo: newUser.officialNo,
        emergencyNo: newUser.emergencyNo,
        accountActive: newUser.accountActive,
      },
    });
  } catch (error) {
    console.error("Error in AddEmployee:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ===========================
      GET ALL EMPLOYEES
=========================== */
export const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("company", "name")
      .select("-password"); // Hide sensitive data

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
    });
  } catch (error) {
    console.error("Error in getAllEmployee:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ===========================
      DELETE EMPLOYEE
=========================== */
export const deleteEmployee = async (req, res) => {
  try {
    // Check if user is superAdmin
    if (!req.user || req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Only superAdmin can delete employees." });
    }

    const { employeeId } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      deletedEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ===========================
      EDIT EMPLOYEE (ADMIN)
=========================== */
export const editEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updates = req.body;

    // --- Whitelisted fields only ---
    const allowedFields = [
      "fullName",
      "email",
      "phone",
      "department",
      "role",
      "accountActive",
      "lateCount",
      "totalLateDays",
      "totalLateMinutes",
      "halfDays",
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) filteredUpdates[key] = updates[key];
    });

    // --- Handle password update (if admin wants to reset it) ---
    if (updates.password) {
      filteredUpdates.password = await bcrypt.hash(updates.password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(employeeId, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ===========================
      GET SINGLE EMPLOYEE
=========================== */
export const getEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const employee = await Employee.findById(empId)
      .populate("company", "name")
      .select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/* ===========================
      APPLY LEAVE
=========================== */
export const applyLeave = async (req, res) => {
  try {
    const { employeeId, companyId, leaveType, startDate, endDate, reason } = req.body;

    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = new Leave({
      employeeId,
      companyId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();
    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({ message: "Error applying leave", error: error.message });
  }
};

/* ===========================
      GET EMPLOYEE LEAVES
=========================== */
export const getMyLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // 🟢 FIXED: use "companyId" not "company"
    const leaves = await Leave.find({ employeeId })
      .populate("companyId", "name") // ✅ Correct field name
      .sort({ appliedAt: -1 });

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leaves found for this employee",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leaves fetched successfully",
      leaves,
    });
  } catch (error) {
    console.error("❌ Error fetching leaves:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leaves",
      error: error.message,
    });
  }
};


export const getAssignedRoles = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const assigned = await AssignedRole.findOne({ employeeId });

    if (!assigned) {
      return res.json({ success: true, assignedRoles: [] });
    }

    return res.json({
      success: true,
      assignedRoles: assigned.workRoles || [], // e.g. ["Lead Management", "Expense"]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching roles" });
  }
};
