import express from "express";
import upload from "../../config/upload.js"; // your multer config
import { createExpense, getAllCheque } from "../controller/expenseController.js";

const router = express.Router();

// POST /expense/expense
// Use 'bill' because your frontend FormData uses data.append("bill", file)
router.post("/", upload.single("bill"), createExpense);

// GET all expenses
router.get("/all", getAllCheque);

export default router;
