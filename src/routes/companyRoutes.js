import express from "express";
import { createCompany, getAllCompanies , getCompanyById, updateCompany} from "../controller/companyController.js";

const router = express.Router();

router.route("/").post(createCompany);
router.route("/all").get(getAllCompanies);
router.route("/:id").get(getCompanyById);
router.route("/:id").patch(updateCompany)


 
export default router;


