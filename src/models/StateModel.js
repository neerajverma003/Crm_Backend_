

import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {  type:{
    type: String,
    required: true,
  },
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

export default mongoose.model("State", stateSchema);