import EmployeeLead from "../models/employeeLeadModel.js";

export const createLead = async (req, res) => {
  try {
    const { employeeId, name , phone ,email, destination , whatsappNo , departureCity ,expectedTravelDate,leadSource,leadType,tripType, leadStatus,value,notes } = req.body;

    // Include employeeId in the data being saved
    const lead = await EmployeeLead.create({
      name,
      departureCity,
      phone,
      whatsappNo,
      destination,
      email,
      expectedTravelDate,
      leadSource,
      leadType,
      leadStatus,
      notes,
      tripType,
      value,
      leadSource,
      employee: employeeId,
    });

    console.log(lead);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const leads = await EmployeeLead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getLeadsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Only populate employee
    const leads = await EmployeeLead.find({ employee: employeeId })
      .populate("employee", "fullName email department");

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: "No leads found for this employee" });
    }

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Error fetching leads by employee ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leads",
      error: error.message,
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params; // ID of the lead to update
    const updateData = req.body; // Fields to update

    if (!leadId) {
      return res.status(400).json({ success: false, message: "Lead ID is required" });
    }

    // Find the lead by ID and update
    const updatedLead = await EmployeeLead.findByIdAndUpdate(
      leadId,
      updateData,
      { new: true, runValidators: true } // return the updated document and validate fields
    );

    if (!updatedLead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating lead",
      error: error.message,
    });
  }
};
