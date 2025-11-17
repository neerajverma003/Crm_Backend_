import express from "express";
import {
  register,
  getUser,
  deleteAdmin,
  editAdmin,
  getAdmin,
  getAllLeaveRequests,
  updateLeaveStatus,
  assignCompany,
  getCompanyByAdminId,
  assignWorkRole,
  getAssignedRoles,
  getAssignedRolesByAdminAndCompany,
  getAdminAssignedRolesById,
  getSubRoleName
} from "../controller/adminController.js";

const router = express.Router();

// Admin CRUD
router.post("/addAdmin", register);
router.get("/getAdmins", getUser);  // all admins
router.get("/getAdmin/:adminId", getAdmin); // single admin
router.put("/editAdmin/:adminId", editAdmin);
router.delete("/deleteAdmin/:adminId", deleteAdmin);

// Company assignment
router.post("/assign", assignCompany);
router.get("/getCompanyByAdminId/:adminId", getCompanyByAdminId);

// Role assignment
router.post("/assignRole", assignWorkRole);
router.get("/getAssignedRoles", getAssignedRoles);
router.get("/getAssignedRoles/:adminId/:companyId", getAssignedRolesByAdminAndCompany);

// Leave management
router.get("/admin/all-leaves", getAllLeaveRequests);
router.put("/admin/update-leave/:leaveId", updateLeaveStatus);
router.get("/getassignedroles/:adminId", getAdminAssignedRolesById);
router.get("/getSubRoleName/:subRoleId", getSubRoleName);

export default router;
