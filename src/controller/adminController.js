import Admin from "../models/Adminmodel.js";
import Company from "../models/CompanyModel.js";
import Role from "../models/roleModel.js";
import Leave from "../models/LeaveModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -------------------- Admin Registration --------------------
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role, accountActive } = req.body;

    if (!fullName || !email || !password || !role || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await Admin.findOne({ email });
    if (duplicate) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const admin = new Admin({
      fullName,
      email,
      password: hashPass,
      role,
      phone,
      accountActive: accountActive !== undefined ? accountActive : true,
    });

    await admin.save();

    return res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Get All Admins --------------------
export const getUser = async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Get Single Admin --------------------
export const getAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({ message: "Admin fetched successfully", admin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Edit Admin --------------------
export const editAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const updateData = req.body;

    const admin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Delete Admin --------------------
export const deleteAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Only superAdmin can delete admins." });
    }

    const { adminId } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ success: true, message: "Admin deleted successfully", deletedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Assign Companies to Admin --------------------
export const assignCompany = async (req, res) => {
  try {
    const { adminId, companyIds } = req.body;

    if (!adminId || !companyIds || !Array.isArray(companyIds)) {
      return res.status(400).json({ message: "adminId and companyIds are required and must be an array" });
    }

    const admin = await Admin.findByIdAndUpdate(adminId, { company: companyIds }, { new: true })
      .populate("company", "companyName email phone address website");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await Company.updateMany({ _id: { $in: companyIds } }, { $addToSet: { admin: adminId } });

    res.status(200).json({ message: "Companies assigned successfully", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Get Companies by Admin ID --------------------
export const getCompanyByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) return res.status(400).json({ message: "Admin ID is required" });

    const admin = await Admin.findById(adminId).populate("company", "companyName email phone address website");

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.company || admin.company.length === 0) return res.status(404).json({ message: "No company assigned" });

    res.status(200).json({ success: true, adminName: admin.fullName, assignedCompanies: admin.company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const assignWorkRole = async (req, res) => {
  try {
    const { adminId, companyIds, workRoles, subRoles = [], points = [] } = req.body;

    if (!adminId || !companyIds?.length || !workRoles?.length) {
      return res.status(400).json({
        message: "adminId, companyIds (array), and workRoles (array) are required",
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Fetch roles from DB
    const roleDocs = await Role.find({ role: { $in: workRoles } });
    if (!roleDocs.length) {
      return res.status(404).json({ message: "No valid roles found" });
    }

    // Process each role
    for (const roleDoc of roleDocs) {
      // Get all valid subRole _ids for THIS specific role (embedded subdocuments)
      const allowedSubRoleIds = (roleDoc.subRole || []).map(sub => sub._id.toString());

      // Filter subRoles: only keep those that belong to THIS role
      const filteredSubRoles = subRoles.filter(subId => {
        const subIdStr = subId.toString();
        return allowedSubRoleIds.includes(subIdStr);
      });

      console.log(`Role: ${roleDoc.role}`);
      console.log(`Allowed SubRole IDs:`, allowedSubRoleIds);
      console.log(`Received SubRole IDs:`, subRoles.map(s => s.toString()));
      console.log(`Filtered SubRole IDs:`, filteredSubRoles.map(s => s.toString()));

      // Check if this role is already assigned to any of these companies
      const existingIndex = admin.assignedRoles.findIndex(existing =>
        existing.roleId.toString() === roleDoc._id.toString() &&
        existing.companyIds.some(c => companyIds.includes(c.toString()))
      );

      if (existingIndex !== -1) {
        // Update existing assignment
        // Replace subRoles with the new filtered ones (only for this role)
        admin.assignedRoles[existingIndex].subRoles = filteredSubRoles;
        admin.assignedRoles[existingIndex].points = points;
        
        // Merge company IDs (avoid duplicates)
        const existingCompanyIds = admin.assignedRoles[existingIndex].companyIds.map(c => c.toString());
        const newCompanyIds = companyIds.filter(c => !existingCompanyIds.includes(c.toString()));
        
        if (newCompanyIds.length > 0) {
          admin.assignedRoles[existingIndex].companyIds.push(...newCompanyIds);
        }
      } else {
        // Create new assignment with filtered subRoles for this specific role
        admin.assignedRoles.push({
          roleId: roleDoc._id,
          companyIds,
          subRoles: filteredSubRoles, // Only subRoles that belong to this role
          points,
        });
      }
    }

    await admin.save();

    // Populate the response for better readability
    await admin.populate([
      {
        path: "assignedRoles.roleId",
        select: "role subRole"
      },
      {
        path: "assignedRoles.companyIds",
        select: "companyName email"
      }
    ]);

    return res.status(200).json({
      message: "Roles assigned successfully",
      assignedRoles: admin.assignedRoles,
    });
  } catch (error) {
    console.error("Error assigning work role:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// -------------------- Get All Assigned Roles --------------------
export const getAssignedRoles = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("fullName assignedRoles")
      .populate({
        path: "assignedRoles.roleId",
        select: "role subRole",
        populate: { path: "subRole", select: "name description" }
      })
      .populate("assignedRoles.companyIds", "companyName email");

    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Get Assigned Roles by Admin & Company --------------------
export const getAssignedRolesByAdminAndCompany = async (req, res) => {
  try {
    const { adminId, companyId } = req.params;
    if (!adminId || !companyId) return res.status(400).json({ message: "Admin ID and Company ID are required" });

    const admin = await Admin.findById(adminId)
      .populate({
        path: "assignedRoles.roleId",
        select: "role subRole",
        populate: { path: "subRole", select: "name description" }
      })
      .populate("assignedRoles.companyIds", "companyName email");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const rolesForCompany = admin.assignedRoles.filter(role =>
      role.companyIds.some(c => c._id.toString() === companyId)
    );

    res.status(200).json({
      success: true,
      adminName: admin.fullName,
      companyId,
      assignedRoles: rolesForCompany.map(role => ({
        roleName: role.roleId?.role || "Unknown",
        subRoles: role.roleId?.subRole || [],
        points: role.points || [],
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Leave Management --------------------
export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employeeId", "fullName email").sort({ appliedAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leave requests", error: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, adminRemark } = req.body;

    if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const leave = await Leave.findByIdAndUpdate(leaveId, { status, adminRemark }, { new: true });
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating leave", error: error.message });
  }
};


export const getAdminAssignedRolesById = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId)
      .select("fullName assignedRoles")
      .populate({
        path: "assignedRoles.roleId",
        select: "role subRole"
      })
      .populate({
        path: "assignedRoles.companyIds",
        select: "companyName"
      })
      .populate({
        path: "assignedRoles.subRoles",
        select: "subRoleName"
      });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });

  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ message: "Server error fetching admin details" });
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