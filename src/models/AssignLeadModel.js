// models/AssignLead.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const assignLeadSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

const AssignLead = mongoose.model("AssignLead", assignLeadSchema);
export default AssignLead;
