import mongoose from "mongoose";

const { Schema } = mongoose;

const expenseSchema = new Schema({
 AmountPaid:{
    type:String,
    required:true,
 },
 PaymentMethod:{
    type:String,
    enum:["Cash","UPI","Card","Bank Transfer"],
    require:true,
 },
 reason:{
    type:String,
    require:true
 },
 date:{
    type:Date,
    require:true
 },
 bill:{
    type:String,
    require:true
 }
}, { timestamps: true });


const ExpenseModel = mongoose.model("Expense", expenseSchema);

export default ExpenseModel;