import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import Lead from "../models/Lead.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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
        // Required field check
        const requiredFields = [
          "name", "email", "phone", "whatsAppNo",
          "departureCity", "destination", "expectedTravelDate",
          "noOfDays", "placesToCover", "noOfPerson", "noOfChild",
          "childAge", "leadSource", "leadType", "tripType",
          "company", "value"
        ];

        const missing = requiredFields.filter(f => !row[f]);
        if (missing.length > 0) {
          skipped++;
          errors.push(`Row ${index + 2}: Missing fields (${missing.join(", ")})`);
          continue;
        }

        // Check for duplicates
        const exists = await Lead.findOne({
          $or: [{ email: row.email }, { phone: row.phone }]
        });

        if (exists) {
          skipped++;
          errors.push(`Row ${index + 2}: Duplicate lead (email/phone already exists)`);
          continue;
        }

        // Create a new lead document
        const lead = new Lead({
          name: row.name,
          email: row.email,
          phone: row.phone,
          whatsAppNo: row.whatsAppNo,
          departureCity: row.departureCity,
          destination: row.destination,
          expectedTravelDate: new Date(row.expectedTravelDate),
          noOfDays: Number(row.noOfDays),
          placesToCover: row.placesToCover,
          noOfPerson: Number(row.noOfPerson),
          noOfChild: Number(row.noOfChild),
          childAge: row.childAge,
          leadSource: row.leadSource,
          leadType: row.leadType,
          tripType: row.tripType,
          company: row.company,
          leadStatus: row.leadStatus || "Hot",
          value: row.value,
          groupNumber: row.groupNumber || "",
          lastContact: row.lastContact ? new Date(row.lastContact) : Date.now(),
          notes: row.notes || "",
        });

        await lead.save();
        inserted++;
      } catch (err) {
        errors.push(`Row ${index + 2}: ${err.message}`);
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Lead import completed",
      total: data.length,
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
});

export default router;
