import express from "express";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeamMembers,
  deleteTeam,
} from "../controller/teamController.js";

const router = express.Router();

router.post("/", createTeam);
router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.put("/:id/members", updateTeamMembers);
router.delete("/:id", deleteTeam);

export default router;
