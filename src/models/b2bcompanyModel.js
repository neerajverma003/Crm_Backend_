import mongoose from "mongoose";

const B2bCompanySchema = new mongoose.Schema(
  {  
      country: {
     type:String,
     required:true,
      },
    state: {
      type: String,
      required: true,
      },
      companyName:{
        type:String,
        required:true,
      },
      contactPersonName:{
        type:String,
        required:true, 
      },
      contactPersonNumber:{
        type:String,
        required:true,
      },
     email:{
          type:String,
          required:true,
        },
    whatsapp:{
      type:String,
      required:true,
    },
    address:{
        type:String,
        required:true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("B2bCompany", B2bCompanySchema);