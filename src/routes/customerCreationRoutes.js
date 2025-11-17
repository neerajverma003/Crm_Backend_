import express from "express";
import { createCustomer, getAllCustomers } from "../controller/customerCreationController.js";


const router = express.Router();

router.route("/").post(createCustomer);
router.route("/all").get(getAllCustomers)

 
export default router;


