import Designation from "../models/designationModel.js";

// export const createDesignation = async (req, res) => {
//   try {
//     const { company, dep, designation } = req.body;
//     if (!company || !dep || !designation) {
//       return res.status(400).json({ messsage: "All fields are required" });
//     }
//     const designationObj = {
//       company,
//       dep,
//       designation,
//     };

//     const newDesignation = new Designation(designationObj);
//     await newDesignation.save();

//     if (newDesignation) {
//       return res.status(200).json({ message: "DESIGNATION ADDED" });
//     }
//   } catch (error) {
//     res.status (500).json({message:"Server Error"})
//   }
// };


export const createDesignation = async (req, res) => {
  try { 
    const { company, dep, designation } = req.body;

    if (!company || !dep || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const designationObj = { company, dep, designation };

    const newDesignation = new Designation(designationObj);
    await newDesignation.save();

    return res.status(200).json({ message: "DESIGNATION ADDED" });
  } catch (error) {
    console.error("Error creating designation:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find().populate("company dep");
    res.json(designations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteDesignation = async(req,res)=>{
  try {
    const {id} = req.params;
    const del = await Designation.findOneAndDelete({_id:id})
    if(!del){
      return res.status(400).json({message:"Department not found"});
    }
    return res.status(200).json({message:"SuccessFully Deleted"})
  } catch (error) {
    console.log("Error in Deleting Department",error)
  }
}