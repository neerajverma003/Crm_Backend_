

import mongoose from "mongoose";

const subRoleSchema = new mongoose.Schema({
  subRoleName: { type: String, required: true },
  points: [String],
});

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true, // ✅ Prevent duplicate roles by name
      trim: true,
    },
    subRole: [subRoleSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
