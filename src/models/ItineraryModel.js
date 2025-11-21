import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {  Destination:{
    type: mongoose.Schema.Types.String,
    required: true,
    ref:"Destination",
  },
      NoOfDay: {
     type:String,
     required:true,
      },
    Upload: [{
      type: String,
      required: true,
      }],
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);