import mongoose from "mongoose";

const { Schema } = mongoose;

const chequeSchema = new Schema({
  entryDate:{
    type:String,
    required:true
  },
  chequeIssuedDate:{
    type:Date,
    required:true,
  },
  receiverName:{
    type:String,
    required:true,
  },
  chequeValid:{
    type:Date,
    required:true,
  },
  chequeNumber:{
    type:String,
    required:true,
  },
  chequeAmount:{
    type:String,
    required:true,
  },
  reasonToIssue:{
    type:String,
    required:true,
  }
}, { timestamps: true });


const ChequeModel = mongoose.model("Cheque", chequeSchema);

export default ChequeModel;