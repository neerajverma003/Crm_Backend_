import Lead from "../models/LeadModel.js"

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




// export const createLead = async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       departureCity,
//       email,
//       whatsAppNo,
//       destination,
//       expectedTravelDate,
//       noOfDays,
//       placesToCover,
//       noOfPerson,
//       noOfChild,
//       childAge,
//       leadSource,
//       leadType,
//       tripType,
//       company,
//       leadStatus,
//       value,
//       groupNumber,
//       lastContact,
//       notes,
//     } = req.body;

//     // Required fields validation
//     if (!name || !phone || !departureCity) {
//       return res.status(400).json({
//         error: "Name, phone, and departureCity are required fields",
//       });
//     }

//     // Convert phone to array if it's a string (comma-separated)
//     const phoneArray = Array.isArray(phone)
//       ? phone
//       : phone.split(",").map((p) => p.trim());

//     // Check for duplicate phone or email
//     const existingLead = await Lead.findOne({
//       $or: [{ email }, { phone: { $in: phoneArray } }],
//     });

//     if (existingLead) {
//       return res.status(400).json({ error: "Lead with this email or phone already exists" });
//     }

//     const newLead = new Lead({
//       name,
//       phone: phoneArray,
//       departureCity,
//       email,
//       whatsAppNo,
//       destination,
//       expectedTravelDate,
//       noOfDays,
//       placesToCover,
//       noOfPerson,
//       noOfChild,
//       childAge,
//       leadSource,
//       leadType,
//       tripType,
//       company,
//       leadStatus,
//       value,
//       groupNumber,
//       lastContact,
//       notes,
//     });

//     const savedLead = await newLead.save();

//     res.status(201).json({ message: "Lead added successfully", lead: savedLead });
//   } catch (err) {
//     console.error("Error creating lead:", err);
//     res.status(500).json({ error: "Server error while adding lead" });
//   }
// };


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