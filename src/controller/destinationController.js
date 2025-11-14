import Destination from "../models/destinationModel.js";
import State from "../models/StateModel.js";

// -------------------------------------
// ✅ Create Destination
// -------------------------------------
export const createDestination = async (req, res) => {
  try {
    const { type, country, state, destinationName } = req.body;

    if (!type || !country || !state || !destinationName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if state exists
    const stateExists = await State.findById(state);
    if (!stateExists) {
      return res.status(404).json({ message: "State not found" });
    }

    const newDestination = new Destination({
      type,
      country,
      state,
      destinationName,
    });

    const savedDest = await newDestination.save();

    res.status(201).json(savedDest);
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ message: "Server error while creating destination" });
  }
};

// -------------------------------------
// ✅ Get All Destinations
// -------------------------------------
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find()
      .populate("state", "state country type"); // populate State details

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: "Server error while fetching destinations" });
  }
};

// -------------------------------------
// ✅ Get Destination by ID
// -------------------------------------
export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).populate(
      "state",
      "state country type"
    );

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({ message: "Server error while fetching destination" });
  }
};

// -------------------------------------
// ✅ Delete Destination
// -------------------------------------
export const deleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ message: "Server error while deleting destination" });
  }
};

// -------------------------------------
// optional: Update Destination
// -------------------------------------
export const updateDestination = async (req, res) => {
  try {
    const { type, country, state, destinationName } = req.body;

    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      { type, country, state, destinationName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Server error while updating destination" });
  }
};
