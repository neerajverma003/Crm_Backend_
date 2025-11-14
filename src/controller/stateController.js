// import State from "../models/stateModel.js";
import State from "../models/StateModel.js"

// ✅ Create a new state
export const createState = async (req, res) => {
  try {
    const { type, country, state } = req.body;

    if (!type || !country || !state) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newState = new State({ type, country, state });
    const savedState = await newState.save();

    res.status(201).json(savedState);
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get all states
export const getStates = async (req, res) => {
  try {
    const states = await State.find();
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
