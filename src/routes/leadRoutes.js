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
  getMatchedLeads,
  assignLead,
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
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (!rawData.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const normalizeKey = (k) => k?.toString().trim().toLowerCase().replace(/\s+/g, "");
    const data = rawData.map((row) => {
      const r = {};
      Object.keys(row || {}).forEach((key) => {
        r[normalizeKey(key)] = row[key];
      });
      return r;
    });

    let inserted = 0;
    let skipped = 0;
    let errors = [];

    for (const [index, row] of data.entries()) {
      try {
        const getField = (obj, keys) => {
          for (const k of keys) {
            if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
          }
          return undefined;
        };

        const phoneVal = getField(row, [
          "phone",
          "phoneno",
          "contact",
          "contactnumber",
          "mobile",
          "mobileno",
          "whatsapp",
          "whatsappno",
        ]);

        if (!phoneVal) {
          skipped++;
          errors.push(`Row ${index + 2}: Missing required field (phone)`);
          continue;
        }

        const exists = await Lead.findOne({ phone: phoneVal });
        if (exists) {
          skipped++;
          errors.push(`Row ${index + 2}: Duplicate lead (phone already exists)`);
          continue;
        }

        const lead = new Lead({
          phone: String(phoneVal),
          name: getField(row, ["name"]) || "",
          departureCity: getField(row, ["departurecity"]) || "",
          email: getField(row, ["email"]) || "",
          whatsAppNo: getField(row, ["whatsappno", "whatsapp"]) || "",
          destination: getField(row, ["destination"]) || "",
          expectedTravelDate: getField(row, ["expectedtraveldate"]) ? new Date(getField(row, ["expectedtraveldate"])) : null,
          noOfDays: getField(row, ["noofdays"]) ? Number(getField(row, ["noofdays"])) : null,
          placesToCover: getField(row, ["placestocover"]) || "",
          noOfPerson: getField(row, ["noofperson"]) ? Number(getField(row, ["noofperson"])) : null,
          noOfChild: getField(row, ["noofchild"]) ? Number(getField(row, ["noofchild"])) : null,
          childAges: getField(row, ["childages", "childage"]) ? [].concat(getField(row, ["childages", "childage"])) : [],
          leadSource: getField(row, ["leadsource"]) || "",
          leadType: getField(row, ["leadtype"]) || "",
          tripType: getField(row, ["triptype"]) || "",
          company: getField(row, ["company"]) || "",
          leadStatus: getField(row, ["leadstatus"]) || "Hot",
          value: getField(row, ["value"]) ? Number(getField(row, ["value"])) : null,
          groupNumber: getField(row, ["groupnumber"]) || "",
          lastContact: getField(row, ["lastcontact"]) ? new Date(getField(row, ["lastcontact"])) : Date.now(),
          notes: getField(row, ["notes"]) || "",
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
      insertedCount: inserted,
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
router.post("/lead", createLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);
router.get("/employee/matched-leads",  getMatchedLeads);
router.post("/assign", assignLead);
export default router;
