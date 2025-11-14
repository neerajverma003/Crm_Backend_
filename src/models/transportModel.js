import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
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
    transportName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    // transportAddress: {
    //   type: String,
    // },
    transportEmail: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    contactPersonNumber: {
      type: String,
    },
    // rating:{
    //     type: String,
    // }
  },
  { timestamps: true }
);

export default mongoose.model("Transport", transportSchema);
