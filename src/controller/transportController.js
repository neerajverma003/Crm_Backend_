import Transport from "../models/transportModel.js";

// ------------------ CREATE TRANSPORT ------------------
export const createTransport = async (req, res) => {
  try {
    const {
      type,
      country,
      state,
      destination,
      transportName,
      phoneNumber,
      transportEmail,
      whatsappNumber,
      contactPersonNumber,
    } = req.body;

    // Validation
    if (!type || !state || !destination || !transportName) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newTransport = new Transport({
      type,
      country,
      state,
      destination,
      transportName,
      phoneNumber,
      transportEmail,
      whatsappNumber,
      contactPersonNumber,
    });

    const savedTransport = await newTransport.save();
    res.status(201).json(savedTransport);
  } catch (error) {
    console.error("Error creating transport:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET ALL TRANSPORTS ------------------
export const getTransports = async (req, res) => {
  try {
    const transports = await Transport.find()
      .populate("state", "state")
      .populate("destination", "destinationName")
      .sort({ createdAt: -1 });

    res.status(200).json(transports);
  } catch (error) {
    console.error("Error fetching transports:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET SINGLE TRANSPORT ------------------
export const getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate("state", "state")
      .populate("destination", "destinationName");

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    res.status(200).json(transport);
  } catch (error) {
    console.error("Error fetching transport:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ UPDATE TRANSPORT ------------------
export const updateTransport = async (req, res) => {
  try {
    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTransport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    res.status(200).json(updatedTransport);
  } catch (error) {
    console.error("Error updating transport:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ DELETE TRANSPORT ------------------
export const deleteTransport = async (req, res) => {
  try {
    const deletedTransport = await Transport.findByIdAndDelete(req.params.id);

    if (!deletedTransport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    res.status(200).json({ message: "Transport deleted successfully" });
  } catch (error) {
    console.error("Error deleting transport:", error);
    res.status(500).json({ message: "Server error" });
  }
};
