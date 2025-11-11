import Company from "../models/CompanyModel.js"

export const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      email,
      phoneNumber,
      website,
      address,
      numberOfEmployees,
      status = "Active", // Default status if not provided
    } = req.body;

    // Check if all required fields are provided
    if (
      !companyName ||
      !industry ||
      !email ||
      !phoneNumber ||
      !website ||
      !address ||
      !numberOfEmployees
    ) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check if company with the same name already exists
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return res
        .status(409)
        .json({ 
          success: false,
          message: "Company with this name already exists" 
        });
    }

    // Create new company
    const newCompany = new Company({
      companyName,
      industry,
      email,
      phoneNumber,
      website,
      address,
      numberOfEmployees,
      status,
    });

    const savedCompany = await newCompany.save();
    
    if (!savedCompany) {
      return res.status(500).json({
        success: false,
        message: "Failed to save company"
      });
    }

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: savedCompany,
    });
    } catch (error) {
        console.log("Company creation error:", error.message);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

export const getAllCompanies = async(req ,res )=>{
    try {
        const companies = await Company.find({})
        if(!companies?.length){
            return res.status(404).json({message:"No companies found"})
        }
        return res.status(200).json({companies})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
        }
}





export const getCompanyById = async(req,res)=>{
    try {
        const {id }= req.params;
        const company = await Company.findById(id);
        if(!company){
            return res.status(404).json({message:"Company not found"})
        }
        return res.status(200).json({company})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"}) 
       }
}


export const updateCompany = async(req,res)=>{
    try {
        const {id} = req.params;
        const company = await Company.findByIdAndUpdate(id)
        const {companyName , phoneNumber , address , email , industry ,website , status , numberOfEmployees} = req.body;
        if(!company){
            return res.status(404).json({message:"Company not found"})
        }
        const duplicate = await Company.findOne({companyName});
        if(duplicate){
            return res.status(400).json({message:"Company name already exists"})
        }
        (company.companyName = companyName),
        (company.phoneNumber = phoneNumber),    
        (company.address = address),
        (company.email = email),
        (company.industry = industry),
        (company.website = website),
        (company.status = status),
        (company.numberOfEmployees = numberOfEmployees)

        await company.save();
        return res.status(200).json({message:"Company updated successfully",company})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}