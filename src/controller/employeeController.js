import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Role from "../models/roleModel.js"
import Employee from "../models/employeeModel.js";
import Leave from "../models/LeaveModel.js";
import Company from "../models/CompanyModel.js"
import Designation from "../models/designationModel.js";
/* ===========================
      ADD EMPLOYEE
=========================== */
// export const AddEmployee = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       password,
//       department,
//       company,
//       designation,
//       role,
//       accountActive = true,
//       officialNo,
//       emergencyNo
//     } = req.body;

//     // --- Required Fields Check ---
//     if (
//       !fullName ||
//       !email ||
//       !phone ||
//       !department ||
//       !password ||
//       !officialNo ||
//       !emergencyNo ||
//       !designation ||
//       !company
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // --- Validate Company as Array ---
//     if (!Array.isArray(company) || company.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Company must be a non-empty array",
//       });
//     }

//     // Validate each company ID
//     for (const id of company) {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid company ID: ${id}`,
//         });
//       }
//     }

//     // --- Validate Designation ---
//     if (!mongoose.Types.ObjectId.isValid(designation)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid designation ID",
//       });
//     }

//     // --- Check for Existing Employee ---
//     const existingUser = await Employee.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Employee already exists with this email or phone number",
//       });
//     }

//     // --- Password Hash ---
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // --- Create Employee ---
//     const newUser = new Employee({
//       fullName,
//       email,
//       phone,
//       password: hashedPassword,
//       department,
//       company,
//       designation,
//       role: role || "Employee",
//       officialNo,
//       emergencyNo,
//       accountActive,
//     });

//     await newUser.save();

//     return res.status(201).json({
//       success: true,
//       message: "Employee added successfully",
//       employee: {
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         phone: newUser.phone,
//         company: newUser.company,
//         department: newUser.department,
//         role: newUser.role,
//         officialNo: newUser.officialNo,
//         emergencyNo: newUser.emergencyNo,
//         accountActive: newUser.accountActive,
//         designation: newUser.designation,
//       },
//     });
//   } catch (error) {
//     console.error("Error in AddEmployee:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };







export const getAllBDEEmployees = async (req, res) => {
  try {
    // Populate designation and filter employees with designation title "BDE"
    const employees = await Employee.find()
      .populate({
        path: "designation",
        select: "title _id", // Only fetch title and _id
      });

    // Filter employees whose designation title is "BDE"
    const bdeEmployees = employees.filter(
      (emp) => emp.designation && emp.designation.title === "BDE"
    );

    res.status(200).json({
      success: true,
      employees: bdeEmployees,
      message: "BDE employees fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching BDE employees:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};





export const AddEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      officialNo,
      emergencyNo,
      department,
      designation,
      company,
      password,
      role,
      accountActive = true,
    } = req.body;

    // 1️⃣ All roles must have these
    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !officialNo ||
      !emergencyNo ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2️⃣ Employee-specific required fields
    if (role === "Employee") {
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company is required for Employee",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID",
        });
      }

      if (!department) {
        return res
          .status(400)
          .json({ success: false, message: "Department is required" });
      }

      if (!designation) {
        return res
          .status(400)
          .json({ success: false, message: "Designation is required" });
      }
    }

    // 3️⃣ Admin role → these values become NULL (optional)
    const companyValue =
      role === "Admin" || role === "superadmin" ? null : company;

    const departmentValue =
      role === "Admin" || role === "superadmin" ? null : department;

    const designationValue =
      role === "Admin" || role === "superadmin" ? null : designation;

    // 4️⃣ Check duplicates
    const existingUser = await Employee.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Employee already exists with this email or phone",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Employee({
      fullName,
      email,
      phone,
      officialNo,
      emergencyNo,
      role,
      password: hashedPassword,
      accountActive,
      company: companyValue,
      department: departmentValue,
      designation: designationValue,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newUser,
    });
  } catch (error) {
    console.error("AddEmployee Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


/* ===========================
      GET ALL EMPLOYEES
=========================== */
// export const getAllEmployee = async (req, res) => {
//   try {
//     const employees = await Employee.find()
//       .populate("company", "name")
//       .select("-password"); // Hide sensitive data

//     return res.status(200).json({
//       success: true,
//       message: "Employees fetched successfully",
//       employees,
//     });
//   } catch (error) {
//     console.error("Error in getAllEmployee:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   } 
// };


export const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("company", "companyName")       // fetch company name
      .populate("designation", "designation")   // fetch designation title
      .populate("department", "dep")           // fetch department name
      .select("-password");                     // hide sensitive data

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
      "designation",
      "company",
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

    // Convert string to ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ success: false, message: "Invalid employee ID" });
    }

    const assigned = await Employee.findById(employeeId).lean();

    if (!assigned) {
      return res.json({ success: true, assignedRoles: [] });
    }

    return res.json({
      success: true,
      assignedRoles: assigned.assignedRoles || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching roles" });
  }
};




export const assignCompany = async (req, res) => {
  try {
    const { employeeId, companyIds } = req.body;

    if (!employeeId || !companyIds || !Array.isArray(companyIds)) {
      return res.status(400).json({ message: "adminId and companyIds are required and must be an array" });
    }

    const admin = await Employee.findByIdAndUpdate(employeeId, { company: companyIds }, { new: true })
      .populate("company", "companyName email phone address website");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await Company.updateMany({ _id: { $in: companyIds } }, { $addToSet: { admin: employeeId } });
    console.log(admin)
    res.status(200).json({ message: "Companies assigned successfully", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const { Types } = mongoose;

export const assignWorkRole = async (req, res) => {
  try {
    const { employeeId, companyIds, workRoles, subRoles = [], points = [] } = req.body;

    // 1️⃣ Validation
    if (!employeeId || !companyIds?.length || !workRoles?.length) {
      return res.status(400).json({
        success: false,
        message: "Employee, company, and at least one role are required",
      });
    }

    // 2️⃣ Fetch employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // 3️⃣ Convert all IDs to ObjectId
    const companyObjectIds = companyIds.map(c => new Types.ObjectId(c));
    const workRoleObjectIds = workRoles.map(r => new Types.ObjectId(r));
    const subRoleObjectIds = subRoles.map(s => new Types.ObjectId(s));

    // 4️⃣ Check for duplicates in assignedRoles
    const isDuplicate = employee.assignedRoles.some((ar) => {
      const roleMatch = ar.roleId.some(r => workRoleObjectIds.includes(r));
      const companyMatch = ar.companyIds.some(c => companyObjectIds.includes(c));
      const subRoleMatch = ar.subRoles.some(s => subRoleObjectIds.includes(s));
      const pointsMatch = points.every(p => ar.points.includes(p));
      return roleMatch && companyMatch && subRoleMatch && pointsMatch;
    });

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: "This role assignment already exists for the employee",
      });
    }

    // 5️⃣ Push new assignedRole
    employee.assignedRoles.push({
      roleId: workRoleObjectIds,
      companyIds: companyObjectIds,
      subRoles: subRoleObjectIds,
      points: Array.from(new Set(points)), // remove duplicate points
    });

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Roles, subRoles, and points assigned successfully",
      data: employee,
    });

  } catch (error) {
    console.error("❌ Error in assignWorkRole:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getCompanyByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) 
      return res.status(400).json({ message: "Employee ID is required" });

    // Fetch employee and populate assigned companies
    const employee = await Employee.findById(employeeId).populate(
      "company",
      "companyName email phone address website"
    );

    if (!employee) 
      return res.status(404).json({ message: "Employee not found" });

    if (!employee.company || employee.company.length === 0) 
      return res.status(404).json({ message: "No company assigned" });

    res.status(200).json({
      success: true,
      employeeName: employee.fullName,
      assignedCompanies: employee.company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getDepartments = async (req, res) => {
  try {
    // Fetch only the 'department' field
    const departments = await Employee.find({}, { department: 1, _id: 0 });

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching departments",
    });
  }
};


export const getSubRoleName = async (req, res) => {
  try {
    const { subRoleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subRoleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subRole ID format",
      });
    }

    // Find a role document containing that subRole
    const role = await Role.findOne({ "subRole._id": subRoleId });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "SubRole not found in any Role",
      });
    }

    // Extract that subRole’s name
    const subRole = role.subRole.find(
      (s) => s._id.toString() === subRoleId
    );

    res.status(200).json({
      success: true,
      subRoleName: subRole.subRoleName,
    });
  } catch (error) {
    console.error("Error fetching subRole name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SubRole name",
      error: error.message,
    });
  }
};