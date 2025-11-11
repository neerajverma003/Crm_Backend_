import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import Lead from "../models/LeadModel.js";
import {
  getAllLeads,
  getLeadStats,
  getLeadsByStatus,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from "../controller/leadController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* --------------------------------
   ✅  Excel Upload Route
---------------------------------- */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    let inserted = 0;
    let skipped = 0;
    let errors = [];

    for (const [index, row] of data.entries()) {
      try {
        // Only phone is required
        if (!row.phone) {
          skipped++;
          errors.push(`Row ${index + 2}: Missing required field (phone)`);
          continue;
        }

        // Skip duplicate phone
        const exists = await Lead.findOne({ phone: row.phone });
        if (exists) {
          skipped++;
          errors.push(`Row ${index + 2}: Duplicate lead (phone already exists)`);
          continue;
        }

        // Create lead; other fields are optional
        const lead = new Lead({
          phone: row.phone,
          name: row.name || "",
          departureCity: row.departureCity || "",
          email: row.email || "",
          whatsAppNo: row.whatsAppNo || "",
          destination: row.destination || "",
          expectedTravelDate: row.expectedTravelDate ? new Date(row.expectedTravelDate) : null,
          noOfDays: row.noOfDays ? Number(row.noOfDays) : null,
          placesToCover: row.placesToCover || "",
          noOfPerson: row.noOfPerson ? Number(row.noOfPerson) : null,
          noOfChild: row.noOfChild ? Number(row.noOfChild) : null,
          childAge: row.childAge || "",
          leadSource: row.leadSource || "",
          leadType: row.leadType || "",
          tripType: row.tripType || "",
          company: row.company || "",
          leadStatus: row.leadStatus || "Hot",
          value: row.value ? Number(row.value) : null,
          groupNumber: row.groupNumber || "",
          lastContact: row.lastContact ? new Date(row.lastContact) : Date.now(),
          notes: row.notes || "",
        });

        await lead.save();
        inserted++;
      } catch (err) {
        skipped++;
        errors.push(`Row ${index + 2}: ${err.message}`);
      }
    }

    fs.unlinkSync(req.file.path); // delete uploaded file

    res.json({
      message: "Lead import completed",
      total: data.length,
      inserted,
      skipped,
      errors,
      successRate: ((inserted / data.length) * 100).toFixed(2) + "%",
      failedRate: ((skipped / data.length) * 100).toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
});




/* --------------------------------
   ✅ CRUD API Routes
---------------------------------- */
router.get("/", getAllLeads);
router.get("/stats", getLeadStats);
router.get("/status/:status", getLeadsByStatus);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;
