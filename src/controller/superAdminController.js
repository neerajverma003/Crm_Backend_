import superAdmin from "../models/SuperAdminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const addSuperAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingAdmin = await superAdmin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new superAdmin({ fullName, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Super admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSuperAdminById = async (req,res)=>{
  try {
    const {id}= req.params;

    const SuperAdmin = await superAdmin.findById(id)
    if(!SuperAdmin){
      return res.status(400).json({message:"Super admin not found"})
    }
    return res.status(200).json({SuperAdmin})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Server error"})
  }
}

export { addSuperAdmin };