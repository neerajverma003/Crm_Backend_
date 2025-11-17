import express from "express";
import { createCustomer, getAllCustomers, getCustomerById } from "../controller/customerCreationController.js";


const router = express.Router();

router.route("/").post(createCustomer);
router.route("/all").get(getAllCustomers)
router.route("/:id").get(getCustomerById)
 
export default router;


