

import mongoose from "mongoose";

const b2bstateSchema = new mongoose.Schema(
  { 
      country: {
     type:String,
     required:true,
      },
    state: {
      type: String,
      required: true,
      },
  },
  { timestamps: true }
);

export default mongoose.model("b2bState", b2bstateSchema);