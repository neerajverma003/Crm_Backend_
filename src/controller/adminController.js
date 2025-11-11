// import Admin from "../models/Adminmodel.js"; // Include .js extension
// import Company from "../models/CompanyModel.js"
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import Role from "../models/roleModel.js";
// import Leave from "../models/LeaveModel.js";


// import mongoose from "mongoose";
// export const register = async (req, res) => {
//   try {
//     const { fullName, email, password,phone, role, accountActive   } = req.body;
//     console.log(req.body)
//     // Validate required fields
//     if (!fullName || !email || !password || !role||!phone) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if email already exists
//     const duplicate = await Admin.findOne({ email });
//     if (duplicate) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash password
//     const hashPass = await bcrypt.hash(password, 10);

//     // Create admin object
//     const adminObj = {
//       fullName,
//       email,
//       password: hashPass,
//       role,
//       // department,
//       phone,
//       // company,
//       accountActive: accountActive !== undefined ? accountActive : true,
//     };

//     const admin = new Admin(adminObj);
//     await admin.save();

//     return res.status(201).json({ message: "Admin successfully created", admin });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

// export const assignCompany = async (req, res) => {
//   try {
//     const { adminId, companyIds } = req.body;

//     // Validate input
//     if (!adminId || !companyIds || !Array.isArray(companyIds)) {
//       return res.status(400).json({ message: "adminId and companyIds are required and companyIds must be an array" });
//     }

//     // 1. Update Admin: set assigned companies
//     const admin = await Admin.findByIdAndUpdate(
//       adminId,
//       { company: companyIds }, // note: your Admin model field is `company`
//       { new: true }
//     ).populate("company"); // populate company details

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // 2. Update each Company: add admin to company.admin array
//     await Company.updateMany(
//       { _id: { $in: companyIds } },
//       { $addToSet: { admin: adminId } } // add adminId to admin array, avoid duplicates
//     );

//     return res.status(200).json({
//       message: "Companies assigned to admin successfully",
//       admin,
//     });
//   } catch (error) {
//     console.error("Assign Companies Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const getUser = async(req,res)=>{
//   try {
//     const data = await Admin.find();
//     if(!data){
//       return res.status(404).json({msg:"not working"});
//     }

//     return res.status(200).json(data);
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({message:"Server error "})
//   }
// }


// export const refresh = async (req, res) => {
//   try {
//     const { cookies } = req.body;
//     if (!cookies) {
//       return res.status(400).json({ message: "Unauthorized" });
//     }
//     const refreshToken = cookies.jwt;
//     if (!refreshToken) {
//       return res.status(400).json({ message: "Unauthorized" });
//     }
//     jwt.verify(refreshToken, process.env.REFRESH_JWT, async (err, decoded) => {
//       try {
//         if (err) {
//           return res.status(400).json({ message: "Unauthorized" });
//         }
//         const findUser = await User.findOne({ id: decoded.id });

//         const accessToken = jwt.sign({ id: findUser._id }, process.env.JWT, {
//           expiresIn: "12h",
//         });
//         res.json(accessToken);
//       } catch (error) {
//         return res.status(500).json({ message: "Server error" });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


// export const getAllLeaveRequests = async (req, res) => {
//   try {
//     const leaves = await Leave.find()
//       .populate("employeeId", "fullName email")
//       .sort({ appliedAt: -1 });

//     res.status(200).json(leaves);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching leave requests", error: err.message });
//   }
// };

// export const updateLeaveStatus = async (req, res) => {
//   try {
//     const { leaveId } = req.params;
//     const { status, adminRemark } = req.body;
    
//     if (!["Approved", "Rejected"].includes(status))
//       return res.status(400).json({ message: "Invalid status" });

//     const leave = await Leave.findByIdAndUpdate(
//       leaveId,
//       { status, adminRemark },
//       { new: true }
//     );

//     if (!leave) return res.status(404).json({ message: "Leave not found" });

//     res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating leave", error: err.message });
//   }
// };

// export const deleteAdmin = async (req, res) => {
//   try {
//     // ✅ Ensure only superAdmin can delete
//     if (!req.user || req.user.role !== "superAdmin") {
//       return res
//         .status(403)
//         .json({ message: "Only superAdmin can delete admins." });
//     }

//     const { adminId } = req.params;

//     // ✅ Find and delete from Admin collection
//     const deletedAdmin = await Admin.findByIdAndDelete(adminId);

//     if (!deletedAdmin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Admin deleted successfully",
//       deletedAdmin,
//     });
//   } catch (error) {
//     console.error("❌ Error deleting admin:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




// export const editAdmin = async (req, res) => {
//   try {
//     const { adminId } = req.params;
//     const updateData = req.body;

//     const admin = await Admin.findByIdAndUpdate(adminId, updateData, {
//       new: true, // return updated document
//       runValidators: true, // ensures validation rules in schema are applied
//     });

//     if (!admin) {
//       return res.status(404).json({ msg: "Admin not found" });
//     }

//     return res.status(200).json({
//       msg: "Admin updated successfully",
//       admin,
//     });
//   } catch (error) {
//   }
// };


// export const getAdmin  = async (req, res) => {
//   try {
//     const { adminId } = req.params;
//     const admin = await Admin.findById(adminId);
//     if (!admin) {
//       return res.status(404).json({ msg: "Admin not found" });
//     }
//     return res.status(200).json({
//       msg: "Admin fetched successfully",
//       admin,
//     });
//   } catch (error) {
//     console.error("Error fetching admin:", error);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// };  



// export const getCompanyByAdminId = async (req, res) => {
//   try {
//     const { adminId } = req.params;

//     if (!adminId) {
//       return res.status(400).json({ message: "Admin ID is required" });
//     }

//     // 1️⃣ Find the admin and populate assigned companies
//     const admin = await Admin.findById(adminId)
//       .populate("company", "companyName email phone address website");

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     if (!admin.company || admin.company.length === 0) {
//       return res.status(404).json({ message: "No company assigned to this admin" });
//     }

//     // 2️⃣ Send the company details
//     res.status(200).json({
//       success: true,
//       adminName: admin.fullName,
//       assignedCompanies: admin.company,
//     });
//   } catch (error) {
//     console.error("Error fetching company by admin ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching company details",
//       error: error.message,
//     });
//   }
// };




// export const getAssignedRoles = async (req, res) => {
//   try {
//     // Find all admins and populate assignedRoles.roleId (with subRole)
//     const admins = await Admin.find()
//       .populate({
//         path: 'assignedRoles.roleId',
//         populate: { path: 'subRole' } // populate subRoles of the role
//       })
//       .populate('assignedRoles.companyIds'); // populate companies

//     res.status(200).json(admins);
//   } catch (error) {
//     console.error('Error fetching assigned roles:', error);
//     res.status(500).json({ message: error.message });
//   }
// };


// export const assignWorkRole = async (req, res) => {
//   try {
//     const { adminId, companyIds, workRoles, subRoles, points } = req.body;

//     // Validate input
//     if (!adminId || !companyIds || !Array.isArray(companyIds) || !workRoles || !Array.isArray(workRoles)) {
//       return res.status(400).json({ 
//         message: "adminId, companyIds (array), and workRoles (array) are required" 
//       });
//     }

//     // Find the admin
//     const admin = await Admin.findById(adminId);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // Find all roles by their names and get their IDs
//     const roleDocuments = await Role.find({ role: { $in: workRoles } });
//     if (roleDocuments.length === 0) {
//       return res.status(404).json({ message: "No valid roles found" });
//     }

//     // Validate subRoles if provided - check if they exist in the roles
//     let validatedSubRoles = [];
//     if (subRoles && Array.isArray(subRoles) && subRoles.length > 0) {
//       // Extract all valid subRole IDs from the found roles
//       const validSubRoleIds = [];
//       roleDocuments.forEach(role => {
//         if (role.subRole && Array.isArray(role.subRole)) {
//           role.subRole.forEach(sub => {
//             if (sub._id) {
//               validSubRoleIds.push(sub._id.toString());
//             }
//           });
//         }
//       });
      
//       // Filter out invalid subRole IDs
//       validatedSubRoles = subRoles.filter(subRoleId => 
//         validSubRoleIds.includes(subRoleId.toString())
//       );
//     }

//     // Build the assigned roles structure
//     const assignedRoles = roleDocuments.map(roleDoc => ({
//       roleId: roleDoc._id,
//       companyIds: companyIds,
//       subRoles: validatedSubRoles,
//       points: points && Array.isArray(points) ? points : []
//     }));

//     // Update the admin with assigned roles
//     admin.assignedRoles = assignedRoles;

//     // Save the updated admin
//     await admin.save();

//     res.status(200).json({ 
//       message: "Roles assigned successfully", 
//       assignedRoles: admin.assignedRoles 
//     });
//   } catch (error) {
//     console.error("Error assigning work role:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



// // 📁 controllers/adminController.js

// export const getAssignedRolesByAdminAndCompany = async (req, res) => {
//   try {
//     const { adminId, companyId } = req.params;

//     if (!adminId || !companyId) {
//       return res.status(400).json({ message: "Admin ID and Company ID are required" });
//     }

//     // 🔍 Find the admin and filter their assignedRoles for the given company
//     const admin = await Admin.findById(adminId)
//       .populate({
//         path: "assignedRoles.roleId",
//         populate: { path: "subRole" },
//       })
//       .populate("assignedRoles.companyIds");

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // 🎯 Filter assignedRoles to match this company only
//     const rolesForCompany = admin.assignedRoles.filter((role) =>
//       role.companyIds.some((c) => c._id.toString() === companyId)
//     );

//     res.status(200).json({
//       success: true,
//       adminName: admin.fullName,
//       companyId,
//       assignedRoles: rolesForCompany.map((r) => ({
//         roleName: r.roleId?.role || "Unknown",
//         subRoles: r.roleId?.subRole || [],
//         points: r.points || [],
//       })),
//     });
//   } catch (error) {
//     console.error("❌ Error fetching roles:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };




// controllers/adminController.js
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

// -------------------- Assign Work Roles --------------------
// export const assignWorkRole = async (req, res) => {
//   try {
//     const { adminId, companyIds, workRoles, subRoles, points } = req.body;

//     if (!adminId || !companyIds || !Array.isArray(companyIds) || !workRoles || !Array.isArray(workRoles)) {
//       return res.status(400).json({ message: "adminId, companyIds (array), and workRoles (array) are required" });
//     }

//     const admin = await Admin.findById(adminId);
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     const roleDocs = await Role.find({ role: { $in: workRoles } });
//     if (!roleDocs.length) return res.status(404).json({ message: "No valid roles found" });

//     let validatedSubRoles = [];
//     if (subRoles && Array.isArray(subRoles)) {
//       const validSubRoleIds = roleDocs.flatMap(r => (r.subRole || []).map(s => s.toString()));
//       validatedSubRoles = subRoles.filter(id => validSubRoleIds.includes(id.toString()));
//     }

//     const assignedRoles = roleDocs.map(roleDoc => ({
//       roleId: roleDoc._id,
//       companyIds,
//       subRoles: validatedSubRoles,
//       points: points && Array.isArray(points) ? points : [],
//     }));

//     admin.assignedRoles = assignedRoles;
//     await admin.save();

//     res.status(200).json({ message: "Roles assigned successfully", assignedRoles: admin.assignedRoles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
 
// export const assignWorkRole = async (req, res) => {
//   try {
//     const { adminId, companyIds, workRoles, subRoles = [], points = [] } = req.body;

//     if (!adminId || !companyIds?.length || !workRoles?.length) {
//       return res.status(400).json({
//         message: "adminId, companyIds (array), and workRoles (array) are required",
//       });
//     }

//     const admin = await Admin.findById(adminId);
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     // Fetch roles from DB
//     const roleDocs = await Role.find({ role: { $in: workRoles } });
//     if (!roleDocs.length)
//       return res.status(404).json({ message: "No valid roles found" });

//     for (const roleDoc of roleDocs) {
//       // Filter subRoles for this role
//       const allowedSubRoleIds = roleDoc.subRole.map(s => s._id.toString());
//       const filteredSubRoles = subRoles.filter(subId =>
//         allowedSubRoleIds.includes(subId.toString())
//       );

//       // Check if role already assigned for any of the companies
//       const existingIndex = admin.assignedRoles.findIndex(existing =>
//         existing.roleId.toString() === roleDoc._id.toString() &&
//         existing.companyIds.some(c => companyIds.includes(c.toString()))
//       );

//       const assignment = {
//         roleId: roleDoc._id,
//         companyIds,
//         subRoles: filteredSubRoles,
//         points,
//       };

//       if (existingIndex !== -1) {
//         // Replace subRoles & points for existing role-company
//         admin.assignedRoles[existingIndex].subRoles = filteredSubRoles;
//         admin.assignedRoles[existingIndex].points = points;
//         // Merge companies if needed
//         admin.assignedRoles[existingIndex].companyIds = Array.from(
//           new Set([...admin.assignedRoles[existingIndex].companyIds.map(c => c.toString()), ...companyIds])
//         );
//       } else {
//         // Add new assignment
//         admin.assignedRoles.push(assignment);
//       }
//     }

//     await admin.save();

//     return res.status(200).json({
//       message: "Roles assigned successfully",
//       assignedRoles: admin.assignedRoles,
//     });
//   } catch (error) {
//     console.error("Error assigning work role:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

 


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
