
import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true },
    department: { type: String, enum: ["Sales","Marketing","IT","HR","Admin","Legal","Accounts"], trim: true },
    officalEmail: { type: String },
    company: [{ type: Schema.Types.ObjectId, ref: "Company" }],
    password: { type: String, required: true, trim: true, minlength: 8 },
    accountActive: { type: Boolean, default: true },
    role: { type: String, default: "Admin" },

    // Assigned roles with company, subroles, and points
    assignedRoles: [
      {
        roleId: { type: Schema.Types.ObjectId, ref: "Role" },
        companyIds: [{ type: Schema.Types.ObjectId, ref: "Company" }],
        subRoles: [{ type: Schema.Types.ObjectId }], // Array of subRole IDs
        points: [{ type: String }], // Array of point strings
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
