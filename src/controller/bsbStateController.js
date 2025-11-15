import B2bState from "../models/b2bStateModel.js";

// CREATE a new state
export const createState = async (req, res) => {
  try {
    const { country, state } = req.body;

    if (!country || !state) {
      return res.status(400).json({ message: "Country and state are required." });
    }

    const newState = new B2bState({ country, state });
    const savedState = await newState.save();

    res.status(201).json(savedState);
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all states
export const getAllStates = async (req, res) => {
  try {
    const states = await B2bState.find();
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single state by ID
export const getStateById = async (req, res) => {
  try {
    const state = await B2bState.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json(state);
  } catch (error) {
    console.error("Error fetching state:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE a state by ID
export const updateState = async (req, res) => {
  try {
    const { country, state } = req.body;

    const updatedState = await B2bState.findByIdAndUpdate(
      req.params.id,
      { country, state },
      { new: true, runValidators: true }
    );

    if (!updatedState) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json(updatedState);
  } catch (error) {
    console.error("Error updating state:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a state by ID
export const deleteState = async (req, res) => {
  try {
    const deletedState = await B2bState.findByIdAndDelete(req.params.id);

    if (!deletedState) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    console.error("Error deleting state:", error);
    res.status(500).json({ message: "Server error" });
  }
};
