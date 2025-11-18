import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    industry: {
      type: String,
      enum: ["Manufacturing", "Finance", "Technology", "Healthcare", "Retail"],
      required: [true, "Industry is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },

    phoneNumber: {
      type: Number,
      required: [true, "Phone number is required"],
    },

    website: {
      type: String,
      required: [true, "Website is required"],
      trim: true,
      match: [/^https?:\/\/.+\..+/, "Please fill a valid URL"],
    },

    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: [true, "At least one admin reference is required"],
      },
    ],

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    numberOfEmployees: {
      type: Number,
      required: [true, "Number of employees is required"],
    },

    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Pending",
    },

    // ⭐ ADDED: Department References
    dep: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],

    // ⭐ ADDED: Designation References
    designations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
      },
    ],
    tutorials: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutorial",
    }],
  },
  { timestamps: true }
);

const CompanyModel = mongoose.model("Company", companySchema);

export default CompanyModel;
