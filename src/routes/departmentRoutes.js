import express from "express";
import { createDepartment, getDepartment,deleteDepartment} from "../controller/departmentController.js";

const router = express.Router();

router.route("/").post(createDepartment)
router.route("/department").get(getDepartment)
router.route("/:id").delete(deleteDepartment)
export default router;