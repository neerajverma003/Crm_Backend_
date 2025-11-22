// import mongoose from "mongoose";

// const employeeLeadSchema = new mongoose.Schema({
//   employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // <-- Mongo ID reference
//   name: { type: String, required: false },
//   email: { type: String },
//   phone: { type: String, required: false },
//   departureCity: { type: String, required: false },
//   destination: { type: String },
//   expectedTravelDate: { type: Date },
//   leadSource: { type: String },
//   leadType: { type: String },
//   tripType: { type: String },
//   leadStatus: { type: String, default: "Hot" },
//   value: { type: Number },
//   notes: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// const EmployeeLead = mongoose.model("EmployeeLead", employeeLeadSchema);
// export default EmployeeLead;


import mongoose from "mongoose";

const employeeLeadSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Employee ID reference
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  whatsAppNo: { type: String },
  departureCity: { type: String },
  destination: { type: String },
  expectedTravelDate: { type: Date },
  noOfDays: { type: String },           // e.g., "1n/2d", "Others"
  customNoOfDays: { type: String },    // only if "Others" selected
  placesToCover: { type: String },
  noOfPerson: { type: Number },
  noOfChild: { type: Number },
  childAges: [{ type: Number }],       // dynamic array of child ages
  leadSource: { type: String },
  leadType: { type: String },
  tripType: { type: String },
  leadStatus: { type: String, default: "Hot" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const EmployeeLead = mongoose.model("EmployeeLead", employeeLeadSchema);
export default EmployeeLead;
