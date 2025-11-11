import Cheque from "../models/ChequeModel.js"

export const createCheque = async (req, res) => {
  try {
    const cheque = await Cheque.create(req.body);
    console.log("✅ Lead Created:", Cheque);
    res.status(201).json({ success: true, data: Cheque });
  } catch (error) {
    console.error("❌ Error creating lead:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCheque = async(req,res)=>{
    try {
        const data = await Cheque.find({})
        if(!data){
            return res.status(400).json({message:"No cheque record found"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}