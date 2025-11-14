import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    hotelPhone: {
      type: String,
    },
    hotelAddress: {
      type: String,
    },
    hotelEmail: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    contactPersonNumber: {
      type: String,
    },
    rating:{
        type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
