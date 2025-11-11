import mongoose from "mongoose";
const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    dep: {
      type: String,
      required: true,
      trim: true,
    },
    // designation: {
    //   type: String,
    //   trim: true,
    // },
    // workRole:{
    //   type:String,
    //   require:true,
    // }
  },
  { timestamps: true }
);

// ✅ Unique per company + department combo
departmentSchema.index({ company: 1, dep: 1 }, { unique: true });

const Department = mongoose.model("Department", departmentSchema);
export default Department;