import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company reference is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    accountActive: {
      type: Boolean,
      default: true,
    },
    employeeLead: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeLead", // Use proper model name capitalization
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "Employee"], // Optional: restrict roles
      default: "employee",
    },
    officialNo: {
      type: String,
      required: true,
    },
    emergencyNo: {
      type: String,
      required: true,
    },
     lead: [
    {
      type: Schema.Types.ObjectId,
      ref: "employeeLead",
      required: [false, "At least one company reference is required"],
    },
  ],
    // --- Attendance Stats ---
    totalLateDays: {
      type: Number,
      default: 0,
    },
    totalLateMinutes: {
      type: Number,
      default: 0,
    },
    lateCount: {
      type: Number,
      default: 0,
    },
    halfDays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Optional: Hash password before saving
// employeeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const bcrypt = await import("bcryptjs");
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
