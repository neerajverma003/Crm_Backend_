import Lead from "../models/LeadModel.js"
import Employee from "../models/employeeModel.js"
// Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get lead by ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getMatchedLeads = async (req, res) => {
  try {
    const employeeId = req.user?._id;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID missing from token" });
    }

    // Load employee with destinations field
    const employee = await EmployeeModel.findById(employeeId).lean();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeDestinations = (employee.destinations || [])
      .map((d) => d.destination?.trim().toLowerCase())
      .filter(Boolean);

    // If employee has no destinations, return empty
    if (employeeDestinations.length === 0) {
      return res.status(200).json({ matchedLeads: [] });
    }

    // Load all leads
    const leads = await LeadModel.find().lean();

    // Match destination (case insensitive)
    const matchedLeads = leads.filter((lead) => {
      if (!lead || !lead.destination) return false;

      const leadDest = lead.destination.trim().toLowerCase();
      return employeeDestinations.includes(leadDest);
    });

    return res.status(200).json({ matchedLeads });
  } catch (error) {
    console.error("Error matching destinations:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};


// Create new lead
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    console.log(lead)
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Update lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leads by status
export const getLeadsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const leads = await Lead.find({ leadStatus: status }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get lead statistics
export const getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const hotLeads = await Lead.countDocuments({ leadStatus: 'Hot' });
    const warmLeads = await Lead.countDocuments({ leadStatus: 'Warm' });
    const coldLeads = await Lead.countDocuments({ leadStatus: 'Cold' });
    const convertedLeads = await Lead.countDocuments({ leadStatus: 'Converted' });
    const lostLeads = await Lead.countDocuments({ leadStatus: 'Lost' });
    
    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        convertedLeads,
        lostLeads
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};