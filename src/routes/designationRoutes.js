import express from "express"
import { createDesignation,getDesignations,deleteDesignation } from "../controller/designationController.js"

const router = express.Router();
router.route("/").post(createDesignation)
router.route("/").get(getDesignations)
router.route("/:id").delete(deleteDesignation)
export default router;