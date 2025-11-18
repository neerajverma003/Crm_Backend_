import mongoose from "mongoose";

const employeeDestinationSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

const EmployeeDestination = mongoose.model(
  "EmployeeDestination",
  employeeDestinationSchema
);

export default EmployeeDestination;
