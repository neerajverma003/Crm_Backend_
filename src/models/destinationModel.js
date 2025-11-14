import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {  type:{
    type: String,
    required: true,
  },
      country: {
     type:String,
     required:true,
      },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"State",
      required: true,
      },
    destinationName:{
        type:String,
        required:true,
    }  
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);