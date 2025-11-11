import mongoose from "mongoose";

const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
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
    clockIn: {
      type: Date,
    },
    clockOut: {
      type: Date,
    },

    // --- Work Status ---
    status: {
      type: String,
      enum: ["Present", "Grace Present", "Late", "Half Day", "Absent","Sunday","Holiday"],
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
    isLate: {
      type: Boolean,
      default: false,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    isPermissionRequired: {
      type: Boolean,
      default: false,
    },
    permissionStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Not Required"],
      default: "Not Required",
    },

    // --- Auto Insights ---
    workDuration: {
      type: Number, // total minutes worked
      default: 0,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;