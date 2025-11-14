import Department from "../models/departmentModel.js"

// export const createDepartment = async(req , res)=>{
//   try {
//     const {company , dep , designation} = req.body

//     if(!company || !dep || !designation){
//       return res.status(400).json({message:"Fields are required"})
//     }
//     const newDepartment = new Department({ company , dep , designation });
//     console.log(newDepartment)
//     await newDepartment.save();
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({message:"Server Error"})
//   }
// }


export const createDepartment = async (req, res) => {
  try {
    const { company, dep } = req.body;

    if (!company || !dep) {
      return res.status(400).json({ message: "Company and Department are required" });
    }

    // Check if department already exists for this company
    const existing = await Department.findOne({ company, dep });
    if (existing) {
      return res.status(400).json({ message: "Department already exists for this company" });
    }

    const newDepartment = new Department({ company, dep });
    await newDepartment.save();

    return res.status(201).json(newDepartment);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// export const getDepartment = async(req,res)=>{
//   try {
//     const data = await Department.find({})
//     if(!data){
//       return res.status(400).json({message:"No department found"})
//     }
//     return res.status(200).json(data)
//   } catch (error) {
//     console.log(error)
//   }
// }


export const getDepartment = async (req, res) => {
  try {
    const { company } = req.query; // <– read company filter

    const query = {};

    // if company ID is provided → filter
    if (company) {
      query.company = company;
    }

    const departments = await Department.find(query);

    if (!departments.length) {
      return res.status(200).json({ departments: [] });
    }

    return res.status(200).json({ departments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const deleteDepartment = async(req,res)=>{
  try {
    const {id} = req.params;
    const del = await Department.findOneAndDelete({_id:id})
    if(!del){
      return res.status(400).json({message:"Department not found"});
    }
    return res.status(200).json({message:"SuccessFully Deleted"})
  } catch (error) {
    console.log("Error in Deleting Department",error)
  }
}
