import Expense from "../models/ExpenseModel.js";
import cloudinary from "../../config/cloudinary.js"

export const createExpense = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No bill file uploaded" });
    }

    // The uploaded file is available as req.file
    // req.file.path contains the Cloudinary URL (if using multer-storage-cloudinary)
    const { AmountPaid, PaymentMethod, reason, date } = req.body;

    const expense = await Expense.create({
      AmountPaid,
      PaymentMethod,
      reason,
      date,
      bill: req.file.path, // store Cloudinary URL here
    });

    console.log("✅ Expense Created:", expense);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getAllCheque = async(req,res)=>{
    try {
        const data = await Expense.find({})
        if(!data){
            return res.status(400).json({message:"No cheque record found"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}