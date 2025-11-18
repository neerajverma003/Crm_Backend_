// import Tutorial from "../models/tutorialsModel.js";
// import Company from "../models/CompanyModel.js";

// export const createTutorial = async (req, res) => {
//   try {
//     const { company } = req.body; // this is the company _id
//     const file = req.file;
//     console.log(req.body);
//     if (!company || !file) return res.status(400).json({ message: "Company and file are required" });

//     const newTutorial = await Tutorial.create({
//       tutorial: file.path, // or file.url if using Cloudinary
//     });

//     // Add tutorial to company
//     await Company.findByIdAndUpdate(company, { $push: { tutorials: newTutorial._id } });

//     res.status(201).json(newTutorial);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const getAllTutorials = async (req, res) => {
//   try {
//     const tutorials = await Tutorial.find();    
//     res.status(200).json(tutorials);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   } 
// }


// import Tutorial from "../models/tutorialsModel.js";
// import Company from "../models/CompanyModel.js";

// // Create a new tutorial
// export const createTutorial = async (req, res) => {
//   try {
//     const { title, fileUrl, fileType, originalName, company } = req.body;

//     if (!title || !fileUrl || !fileType || !originalName || !company) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Create tutorial
//     const newTutorial = await Tutorial.create({
//       title,
//       fileUrl,       // e.g., Cloudinary URL or local path
//       fileType,
//       originalName,
//       company,       // company _id
//     });

//     // Associate tutorial with the company
//     await Company.findByIdAndUpdate(company, { $push: { tutorials: newTutorial._id } });

//     res.status(201).json(newTutorial);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all tutorials
// export const getAllTutorials = async (req, res) => {
//   try {
//     const tutorials = await Tutorial.find().populate("company", "companyName");
//     res.status(200).json(tutorials);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get tutorial by ID
// export const getTutorialById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const tutorial = await Tutorial.findById(id).populate("company", "companyName");
//     if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });
//     res.status(200).json(tutorial);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete tutorial
// export const deleteTutorial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const tutorial = await Tutorial.findByIdAndDelete(id);
//     if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

//     // Remove tutorial from company
//     await Company.findByIdAndUpdate(tutorial.company, { $pull: { tutorials: tutorial._id } });

//     res.status(200).json({ message: "Tutorial deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
