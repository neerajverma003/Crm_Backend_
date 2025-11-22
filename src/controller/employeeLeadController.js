import EmployeeLead from "../models/employeeLeadModel.js";

// import EmployeeLead from "../models/EmployeeLead.js";

export const createLead = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      phone,
      email,
      whatsAppNo,
      departureCity,
      destination,
      expectedTravelDate,
      leadSource,
      leadType,
      tripType,
      leadStatus,
      notes,
      noOfDays,
      customNoOfDays,
      placesToCover,
      noOfPerson,
      noOfChild,
      childAges,
    } = req.body;

    const lead = await EmployeeLead.create({
      name,
      phone,
      email,
      whatsAppNo,
      departureCity,
      destination,
      expectedTravelDate,
      leadSource,
      leadType,
      tripType,
      leadStatus,
      notes,
      noOfDays,
      customNoOfDays,
      placesToCover,
      noOfPerson,
      noOfChild,
      childAges,
      employee: employeeId,
    });

    console.log("New Lead Created:", lead);
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


export const getAllEmployeeLeads = async (req, res) => {
  try {
    // Fetch all leads with employee info
    const leads = await EmployeeLead.find()
      .populate("employee", "fullName email department") // populate employee details
      .sort({ createdAt: -1 }); // latest first

    if (!leads || leads.length === 0) {
      return res.status(404).json({ success: false, message: "No leads found" });
    }

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Error fetching all employee leads:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all employee leads",
      error: error.message,
    });
  }
};
