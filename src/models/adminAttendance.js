import mongoose from "mongoose";

const { Schema } = mongoose;

const adminAttendanceSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // --- Core Attendance Data ---
    date: {
      type: Date,
      required: true,
      default: () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
      },
    },
    clockIn: { type: Date },
    clockOut: { type: Date },

    // --- Work Status ---
    status: {
      type: String,
      enum: ["Present", "Grace Present", "Late", "Half Day", "Absent"],
      default: "Absent",
    },
    firstHalf: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
    secondHalf: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },

    // --- Late Tracking ---
    isLate: { type: Boolean, default: false },
    lateMinutes: { type: Number, default: 0 },
    isPermissionRequired: { type: Boolean, default: false },
    permissionStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Not Required"],
      default: "Not Required",
    },

    // --- Auto Insights ---
    workDuration: { type: Number, default: 0 }, // in minutes
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

export const AdminAttendance = mongoose.model("AdminAttendance", adminAttendanceSchema);