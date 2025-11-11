import mongoose from "mongoose";

const SubRoleSchema = new mongoose.Schema({
  subRoleName: { type: String },
  points: [{ type: String }],
});

const RoleSchema = new mongoose.Schema({
  role: { type: String, required: true },
  subRole: [SubRoleSchema],
});

export default mongoose.model("Role", RoleSchema);
