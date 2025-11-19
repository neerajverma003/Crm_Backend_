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
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      // required:[true,"Designation is required"]
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
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
      ref: "EmployeeLead",
    },
    role: {
      type: String,
      enum: ["superadmin", "Admin", "Employee"], // Fixed enum
      // default: "Employee",
      required: false,
    },
    officialNo: String,
    emergencyNo: String,
    lead: [
      {
        type: Schema.Types.ObjectId,
        ref: "employeeLead",
      },
    ],
    destinations: [
      {
        type: Schema.Types.ObjectId,
        ref: "EmployeeDestination",
      },
    ],
    // team:[{
    //   type: Schema.Types.ObjectId,
    //   ref: "Team",
    // }],

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    assignedRoles: [
      {
        roleId: [{ type: Schema.Types.ObjectId, ref: "Role" }],
        companyIds: [{ type: Schema.Types.ObjectId, ref: "Company" }],
        subRoles: [{ type: String }],
        points: [{ type: String }],
      },
    ],
    totalLateDays: { type: Number, default: 0 },
    totalLateMinutes: { type: Number, default: 0 },
    lateCount: { type: Number, default: 0 },
    halfDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
