import express from "express";
import Tutorial from "../models/tutorialsModel.js";
import Company from "../models/CompanyModel.js";
import Department from "../models/departmentModel.js";
import upload from "../../config/upload.js";

const router = express.Router();

// =====================
// POST /tutorials
// Upload a tutorial file
// =====================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, company, department } = req.body;
    const file = req.file;

    if (!title || !company || !department || !file) {
      return res.status(400).json({ message: "Title, company, department, and file are required" });
    }

    const depDoc = await Department.findById(department);
    if (!depDoc) {
      return res.status(400).json({ message: "Invalid department" });
    }
    if (String(depDoc.company) !== String(company)) {
      return res.status(400).json({ message: "Department does not belong to the selected company" });
    }

    // Determine file type
    const mimeType = file.mimetype.split("/")[0];
    let fileType = "unknown";
    if (mimeType === "image") fileType = "image";
    else if (mimeType === "video") fileType = "video";
    else if (file.mimetype === "application/pdf") fileType = "pdf";
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      fileType = "ppt";
    }

    // Create tutorial in DB
    const tutorial = await Tutorial.create({
      title,
      company,
      fileUrl: file.path,
      fileType,
      department,
      originalName: file.originalname,
    });

    // Associate tutorial with company
    await Company.findByIdAndUpdate(company, { $push: { tutorials: tutorial._id } });

    res.status(201).json(tutorial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =====================
// GET /tutorials/all
// Get all tutorials
// =====================
router.get("/all", async (req, res) => {
  try {
    const tutorials = await Tutorial.find()
      .populate("company", "companyName")
      .populate("department", "dep")
      .sort({ createdAt: -1 });
    res.status(200).json({ tutorials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =====================
// GET /tutorials/company/:companyId
// Get tutorials by company
// =====================
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const { department } = req.query;
    const query = { company: companyId };
    if (department) query.department = department;
    const tutorials = await Tutorial.find(query)
      .sort({ createdAt: -1 })
      .populate("company", "companyName")
      .populate("department", "dep");
    res.status(200).json({ tutorials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
