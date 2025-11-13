// import mongoose from "mongoose";

// const SubRoleSchema = new mongoose.Schema({
//   subRoleName: { type: String },
//   points: [{ type: String }],
// });

// const RoleSchema = new mongoose.Schema({
//   role: { type: String, required: true },
//   subRole: [SubRoleSchema],
// });

// export default mongoose.model("Role", RoleSchema);


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
