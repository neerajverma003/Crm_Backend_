import B2bCompany from "../models/b2bcompanyModel.js";

// CREATE NEW COMPANY
export const createCompany = async (req, res) => {
  try {
    const newCompany = new B2bCompany(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: "Failed to create company", error });
  }
};

// GET ALL COMPANIES
// export const getCompanies = async (req, res) => {
//   try {
//     const companies = await B2bCompany.find().sort({ createdAt: -1 });
//     res.status(200).json(companies);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch companies", error });
//   }
// };


export const getCompanies = async (req, res) => {
  try {
    const companies = await B2bCompany.find()
      .populate("state", "state") // populate state name
      .sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch companies", error });
  }
};


// GET COMPANY BY ID
// export const getCompanyById = async (req, res) => {
//   try {
//     const company = await B2bCompany.findById(req.params.id);
//     if (!company) {
//       return res.status(404).json({ message: "Company not found" });
//     }
//     res.status(200).json(company);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch company", error });
//   }
// };
 

export const getCompanyById = async (req, res) => {
  try {
    const company = await B2bCompany.findById(req.params.id)
      .populate("state", "state"); // populate state name

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch company", error });
  }
};

// UPDATE COMPANY
export const updateCompany = async (req, res) => {
  try {
    const updatedCompany = await B2bCompany.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: "Failed to update company", error });
  }
};

// DELETE COMPANY
export const deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await B2bCompany.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete company", error });
  }
};
