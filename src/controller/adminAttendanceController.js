import Admin from "../models/Adminmodel.js";
import { AdminAttendance } from "../models/adminAttendance.js";
import moment from "moment-timezone";

/* -------------------------------------------------------------------------- */
/* 🕒 UTILITIES */
/* -------------------------------------------------------------------------- */

// Get today's UTC range
const getTodayRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59));
  return { start, end };
};

// Calculate difference in minutes
const diffInMinutes = (later, earlier) => Math.floor((later - earlier) / (1000 * 60));

/* -------------------------------------------------------------------------- */
/* ✅ CLOCK-IN */
/* -------------------------------------------------------------------------- */
// export const clockIn = async (req, res) => {
//   try {
//     const { adminId, companyId } = req.body;
//     if (!adminId || !companyId)
//       return res.status(400).json({ message: "Admin and company are required." });

//     const admin = await Admin.findById(adminId);
//     if (!admin) return res.status(404).json({ message: "Admin not found." });

//     const { start, end } = getTodayRange();
//     const nowIST = moment().tz("Asia/Kolkata");

//     if (nowIST.day() === 0)
//       return res.status(400).json({ message: "Today is Sunday (Holiday). Clock-in not required." });

//     // Already clocked in check
//     const existing = await AdminAttendance.findOne({
//       admin: adminId,
//       company: companyId,
//       date: { $gte: start, $lte: end },
//     });
//     if (existing) return res.status(400).json({ message: "Already clocked in for today." });

//     // Time rules
//     const today = nowIST.clone().startOf("day");
//     const earliest = today.clone().hour(9).minute(35);
//     const shiftStart = today.clone().hour(10).minute(1);
//     const graceEnd = today.clone().hour(10).minute(15);
//     const lateEnd = today.clone().hour(12).minute(0);
//     const halfDayEnd = today.clone().hour(14).minute(0);

//     if (nowIST.isBefore(earliest))
//       return res.status(400).json({ message: "Clock-in not allowed before 9:35 AM." });
//     if (nowIST.isAfter(halfDayEnd))
//       return res.status(400).json({ message: "Clock-in not allowed after 2:00 PM." });

//     // Determine status
//     let status = "Present",
//       firstHalf = "Present",
//       secondHalf = "Present",
//       remarks = "",
//       lateMinutes = 0,
//       isLate = false;

//     if (nowIST.isBetween(earliest, shiftStart)) {
//       remarks = "On time (Present)";
//     } else if (nowIST.isBetween(shiftStart, graceEnd)) {
//       status = "Grace Present";
//       remarks = "Within grace period (Present)";
//     } else if (nowIST.isBetween(graceEnd, lateEnd)) {
//       status = "Late";
//       isLate = true;
//       lateMinutes = diffInMinutes(nowIST.toDate(), shiftStart.toDate());
//       remarks = `Late by ${lateMinutes} minutes (Still Present)`;
//     } else if (nowIST.isBetween(lateEnd, halfDayEnd)) {
//       status = "Half Day";
//       firstHalf = "Absent";
//       remarks = "Clocked in between 12:00–2:00 PM (Half Day)";
//     }

//     const record = new AdminAttendance({
//       admin: adminId,
//       company: companyId,
//       clockIn: nowIST.toDate(),
//       date: start,
//       status,
//       firstHalf,
//       secondHalf,
//       isLate,
//       lateMinutes,
//       remarks,
//     });

//     await record.save();
//     return res.status(201).json({ message: "Clock-in recorded successfully.", record });
//   } catch (error) {
//     console.error("❌ Clock-in Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


export const clockIn = async (req, res) => {
  try {
    let { adminId, companyId } = req.body;

    // ------------------------------------
    // Validate request
    // ------------------------------------
    if (!adminId || !companyId)
      return res.status(400).json({ message: "Admin and company are required." });

    // ------------------------------------
    // FIX: Ensure companyId becomes an array
    // ------------------------------------
    if (typeof companyId === "string") {
      companyId = companyId.split(",").map(id => id.trim());
    }

    console.log("🔵 Final companyId =", companyId);

    // ------------------------------------
    // Validate Admin
    // ------------------------------------
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    // ------------------------------------
    // Today's UTC date range
    // ------------------------------------
    const { start, end } = getTodayRange();

    // IST time
    const nowIST = moment().tz("Asia/Kolkata");

    // Sunday check
    if (nowIST.day() === 0)
      return res.status(400).json({
        message: "Today is Sunday (Holiday). Clock-in not required.",
      });

    // ------------------------------------
    // Check if already clocked in
    // ------------------------------------
    const existing = await AdminAttendance.findOne({
      admin: adminId,
      company: { $in: companyId },
      date: { $gte: start, $lte: end },
    });

    if (existing)
      return res.status(400).json({ message: "Already clocked in for today." });

    // ------------------------------------
    // Attendance time rules
    // ------------------------------------
    const today = nowIST.clone().startOf("day");
    const earliest = today.clone().hour(9).minute(35);
    const shiftStart = today.clone().hour(10).minute(1);
    const graceEnd = today.clone().hour(10).minute(15);
    const lateEnd = today.clone().hour(12).minute(0);
    const halfDayEnd = today.clone().hour(14).minute(0);

    if (nowIST.isBefore(earliest))
      return res.status(400).json({
        message: "Clock-in not allowed before 9:35 AM.",
      });

    if (nowIST.isAfter(halfDayEnd))
      return res.status(400).json({
        message: "Clock-in not allowed after 2:00 PM.",
      });

    // ------------------------------------
    // Determine Attendance Status
    // ------------------------------------
    let status = "Present";
    let firstHalf = "Present";
    let secondHalf = "Present";
    let remarks = "";
    let lateMinutes = 0;
    let isLate = false;

    if (nowIST.isBetween(earliest, shiftStart)) {
      remarks = "On time (Present)";
    } else if (nowIST.isBetween(shiftStart, graceEnd)) {
      status = "Grace Present";
      remarks = "Within grace period (Present)";
    } else if (nowIST.isBetween(graceEnd, lateEnd)) {
      status = "Late";
      isLate = true;
      lateMinutes = diffInMinutes(nowIST.toDate(), shiftStart.toDate());
      remarks = `Late by ${lateMinutes} minutes (Still Present)`;
    } else if (nowIST.isBetween(lateEnd, halfDayEnd)) {
      status = "Half Day";
      firstHalf = "Absent";
      remarks = "Clocked in between 12:00–2:00 PM (Half Day)";
    }

    // ------------------------------------
    // Create Attendance Record
    // ------------------------------------
    const record = new AdminAttendance({
      admin: adminId,
      company: companyId, // Now correct ARRAY
      clockIn: nowIST.toDate(),
      date: start,
      status,
      firstHalf,
      secondHalf,
      isLate,
      lateMinutes,
      remarks,
    });

    await record.save();

    // ------------------------------------
    // Success Reply
    // ------------------------------------
    return res.status(201).json({
      message: "Clock-in recorded successfully.",
      record,
    });

  } catch (error) {
    console.error("❌ Clock-in Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ CLOCK-OUT */
/* -------------------------------------------------------------------------- */
// export const clockOut = async (req, res) => {
//   try {
//     const { adminId, companyId } = req.body;
//     if (!adminId || !companyId)
//       return res.status(400).json({ message: "Admin and company are required." });

//     const { start, end } = getTodayRange();

//     const record = await AdminAttendance.findOne({
//       admin: adminId,
//       company: companyId,
//       date: { $gte: start, $lte: end },
//     });

//     if (!record) return res.status(404).json({ message: "No clock-in record found." });
//     if (record.clockOut)
//       return res.status(400).json({ message: "Already clocked out today." });

//     const nowIST = moment().tz("Asia/Kolkata");
//     record.clockOut = nowIST.toDate();

//     const workedHours = Number(((nowIST - record.clockIn) / (1000 * 60 * 60)).toFixed(2));
//     record.workDuration = Math.floor(workedHours * 60);

//     // Update status based on worked hours
//     const MIN_HALF = 3;
//     const MIN_FULL = 7;

//     if (workedHours < MIN_HALF) {
//       record.status = "Absent";
//       record.firstHalf = "Absent";
//       record.secondHalf = "Absent";
//       record.remarks = `Worked ${workedHours} hrs — Absent`;
//     } else if (workedHours < MIN_FULL) {
//       record.status = "Half Day";
//       record.remarks = `Worked ${workedHours} hrs — Half Day`;
//     } else {
//       record.status = record.isLate ? "Late" : "Present";
//       record.remarks = `Worked ${workedHours} hrs — ${record.status}`;
//     }

//     await record.save();
//     return res.status(200).json({ message: "Clock-out recorded successfully.", record });
//   } catch (error) {
//     console.error("❌ Clock-out Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const clockOut = async (req, res) => {
  try {
    let { adminId, companyId } = req.body;

    // ------------------------------------
    // Validate request
    // ------------------------------------
    if (!adminId || !companyId)
      return res.status(400).json({
        message: "Admin and company are required.",
      });

    // ------------------------------------
    // FIX: Ensure companyId becomes an array
    // ------------------------------------
    if (typeof companyId === "string") {
      companyId = companyId.split(",").map(id => id.trim());
    }

    console.log("🟠 Final companyId for clock-out =", companyId);

    // ------------------------------------
    // Today's date range
    // ------------------------------------
    const { start, end } = getTodayRange();

    // ------------------------------------
    // Find today's attendance record
    // ------------------------------------
    const record = await AdminAttendance.findOne({
      admin: adminId,
      company: { $in: companyId },   // FIXED for array support
      date: { $gte: start, $lte: end }
    });

    if (!record)
      return res.status(404).json({
        message: "No clock-in record found.",
      });

    if (record.clockOut)
      return res.status(400).json({
        message: "Already clocked out today.",
      });

    // ------------------------------------
    // Apply clock-out time
    // ------------------------------------
    const nowIST = moment().tz("Asia/Kolkata");
    record.clockOut = nowIST.toDate();

    // ------------------------------------
    // Calculate work duration
    // ------------------------------------
    const workedHours = Number(
      ((nowIST - record.clockIn) / (1000 * 60 * 60)).toFixed(2)
    );
    record.workDuration = Math.floor(workedHours * 60);

    // ------------------------------------
    // Attendance Status Update
    // ------------------------------------
    const MIN_HALF = 3;   // 3 hours = Half Day
    const MIN_FULL = 7;   // 7 hours = Full Day

    if (workedHours < MIN_HALF) {
      record.status = "Absent";
      record.firstHalf = "Absent";
      record.secondHalf = "Absent";
      record.remarks = `Worked ${workedHours} hrs — Absent`;

    } else if (workedHours < MIN_FULL) {
      record.status = "Half Day";
      record.remarks = `Worked ${workedHours} hrs — Half Day`;

    } else {
      record.status = record.isLate ? "Late" : "Present";
      record.remarks = `Worked ${workedHours} hrs — ${record.status}`;
    }

    // ------------------------------------
    // Save & Send Response
    // ------------------------------------
    await record.save();

    return res.status(200).json({
      message: "Clock-out recorded successfully.",
      record,
    });

  } catch (error) {
    console.error("❌ Clock-out Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ GET ALL ADMIN ATTENDANCE */
/* -------------------------------------------------------------------------- */
export const getAllAdminAttendance = async (req, res) => {
  try {
    const records = await AdminAttendance.find()
      .populate("admin", "fullName email role department")
      .populate("company", "name")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ GET ADMIN ATTENDANCE BY ID */
/* -------------------------------------------------------------------------- */
export const getAdminAttendanceById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const records = await AdminAttendance.find({ admin: adminId })
      .populate("admin", "fullName email")
      .sort({ date: -1 });

    if (!records)
      return res.status(404).json({ message: "No attendance found for this admin." });

    res.status(200).json({ message: "Records fetched successfully", data: records });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const editAdminAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    let { clockIn, clockOut, status } = req.body;

    console.log("🟢 Incoming update:", req.body);

    // ✅ Convert clockIn and clockOut to valid Date objects if strings
    const today = new Date();
    const toDateTime = (timeStr) => {
      if (!timeStr) return null;
      // Create a date object using today's date + provided time (like "10:00")
      const [hours, minutes] = timeStr.split(":").map(Number);
      const d = new Date(today);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    if (typeof clockIn === "string") clockIn = toDateTime(clockIn);
    if (typeof clockOut === "string") clockOut = toDateTime(clockOut);

    const updatedAttendance = await AdminAttendance.findByIdAndUpdate(
      id,
      { clockIn, clockOut, status },
      { new: true, runValidators: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json({
      message: "✅ Admin attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("❌ Error updating admin attendance record:", error);
    return res.status(500).json({
      message: "Server error while updating admin attendance",
      error: error.message,
    });
  }
};