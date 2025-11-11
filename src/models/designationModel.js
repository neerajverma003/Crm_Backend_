import mongoose from "mongoose";
const {Schema} = mongoose

const designationSchema = new Schema(
    {
   company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    dep: {
    type:Schema.Types.ObjectId,
    ref:"Department",
    required:true,
    },

    designation:{
        type:String,
        required:true,
        trim:true
    }
    },{
        timestamps:true,
    }
)
designationSchema.index({ company: 1, dep: 1, designation: 1 }, { unique: true });

const Designation = mongoose.model("Designation",designationSchema);
export default Designation