import Team from "../models/teamModel.js";        // Adjust path as needed
import Employee from "../models/employeeModel.js";

// Create Team
// export const createTeam = async (req, res) => {
//   try {
//     const { teamLeaderId, memberIds } = req.body;
//     console.log(req.body)
//     // Validate team leader exists
//     const leader = await Employee.findById(teamLeaderId);
//     if (!leader) {
//       return res.status(404).json({ message: "Team Leader not found" });
//     }

//     // Validate members exist
//     const members = await Employee.find({ _id: { $in: memberIds } });
//     if (members.length !== memberIds.length) {
//       return res.status(404).json({ message: "One or more team members not found" });
//     }

//     // Create team
//     const team = new Team({
//       teamLeader: teamLeaderId,
//       members: memberIds,
//     });
//     await team.save();

//     // Optionally, update Employees to reference the team
//     await Employee.updateMany(
//       { _id: { $in: memberIds } },
//       { team: team._id }
//     );

//     // Optionally, update teamLeader's team too (if needed)
//     await Employee.findByIdAndUpdate(teamLeaderId, { team: team._id });

//     res.status(201).json({ message: "Team created successfully", team });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const createTeam = async (req, res) => {
  try {
    const { teamLeaderId, memberIds } = req.body;

    // Validate team leader
    const leader = await Employee.findById(teamLeaderId);
    if (!leader) return res.status(404).json({ message: "Team Leader not found" });

    // Validate members
    const members = await Employee.find({ _id: { $in: memberIds } });
    if (members.length !== memberIds.length)
      return res.status(404).json({ message: "One or more team members not found" });

    // Create team
    const team = new Team({ teamLeader: teamLeaderId, members: memberIds });
    await team.save();

    // Update Employees' team arrays
    await Employee.updateMany(
      { _id: { $in: memberIds } },
      { $addToSet: { team: team._id } }
    );

    await Employee.findByIdAndUpdate(
      teamLeaderId,
      { $addToSet: { team: team._id } }
    );

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all teams with populated leader and members
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("teamLeader", "fullName email")
      .populate("members", "fullName email");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get team by ID
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("teamLeader", "fullName email")
      .populate("members", "fullName email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update team members (add/remove members)
export const updateTeamMembers = async (req, res) => {
  try {
    const { memberIds } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Validate members
    const members = await Employee.find({ _id: { $in: memberIds } });
    if (members.length !== memberIds.length) {
      return res.status(404).json({ message: "One or more team members not found" });
    }

    team.members = memberIds;
    await team.save();

    // Update Employees' team references
    await Employee.updateMany(
      { team: team._id },
      { $unset: { team: "" } }
    );
    await Employee.updateMany(
      { _id: { $in: memberIds } },
      { team: team._id }
    );

    res.json({ message: "Team members updated", team });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Team
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove team reference from employees
    await Employee.updateMany(
      { team: team._id },
      { $unset: { team: "" } }
    );

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
