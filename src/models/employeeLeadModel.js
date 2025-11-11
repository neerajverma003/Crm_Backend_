// models/EmployeeLead.js
import mongoose from "mongoose";

const employeeLeadSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // <-- Mongo ID reference
  name: { type: String, required: false },
  email: { type: String },
  phone: { type: String, required: false },
  departureCity: { type: String, required: false },
  destination: { type: String },
  expectedTravelDate: { type: Date },
  leadSource: { type: String },
  leadType: { type: String },
  tripType: { type: String },
  leadStatus: { type: String, default: "Hot" },
  value: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
// lead:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"Lead"
// }
});

const EmployeeLead = mongoose.model("EmployeeLead", employeeLeadSchema);
export default EmployeeLead;
