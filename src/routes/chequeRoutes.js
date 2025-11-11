import express from "express";
import { createCheque, getAllCheque } from "../controller/chequeController.js";

const router = express.Router();

router.route("/").post(createCheque);
router.route("/get").get(getAllCheque)


 
export default router;


