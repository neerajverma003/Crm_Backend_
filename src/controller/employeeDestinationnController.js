import EmployeeDestination from "../models/employeeDestination.js";
import Employee from "../models/employeeModel.js";
// CREATE Destination
export const createDestination = async (req, res) => {
  try {
    const { destination } = req.body;

    if (!destination || destination.trim() === "") {
      return res.status(400).json({ message: "Destination is required" });
    }

    const newDestination = await EmployeeDestination.create({ destination });

    res.status(201).json({
      message: "Destination created successfully",
      destination: newDestination,
    });
  } catch (err) {
    console.error("Create Destination Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL Destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await EmployeeDestination.find().sort({ createdAt: -1 });

    res.status(200).json({ destinations });
  } catch (err) {
    console.error("Get Destinations Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE Destination
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await EmployeeDestination.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error("Delete Destination Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// ASSIGN Destination(s) to Employee
export const assignDestination = async (req, res) => {
  try {
    const { employeeId, destinationIds } = req.body;

    // Validation
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!Array.isArray(destinationIds) || destinationIds.length === 0) {
      return res.status(400).json({ message: "Destination IDs are required" });
    }

    // Check Employee Exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate all destination IDs exist
    const validDestinations = await EmployeeDestination.find({
      _id: { $in: destinationIds },
    });

    if (validDestinations.length !== destinationIds.length) {
      return res
        .status(400)
        .json({ message: "One or more destination IDs are invalid" });
    }

    // Avoid duplicates - merge unique IDs
    const updatedDestinations = [
      ...new Set([
        ...employee.destinations.map((id) => id.toString()),
        ...destinationIds,
      ]),
    ];

    // Assign destinations
    employee.destinations = updatedDestinations;
    await employee.save();

    // Populate destinations before sending response
    const populatedEmployee = await Employee.findById(employeeId).populate({
      path: "destinations",
      select: "destination", // only include the 'destination' field
    });

    res.status(200).json({
      success: true,
      message: "Destinations assigned successfully",
      employee: populatedEmployee,
    });
  } catch (err) {
    console.error("Assign Destination Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
