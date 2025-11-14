import Hotel from "../models/hotelModel.js";

// ------------------- CREATE HOTEL -------------------
export const createHotel = async (req, res) => {
  try {
    const {
      type,
      country,
      state,
      destination,
      hotelName,
      hotelPhone,
      hotelAddress,
      hotelEmail,
      whatsappNumber,
      contactPersonNumber,
      rating,
    } = req.body;

    if (!type || !country || !state || !destination || !hotelName ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newHotel = await Hotel.create({
      type,
      country,
      state,
      destination,
      hotelName,
      hotelPhone,
      hotelAddress,
      hotelEmail,
      whatsappNumber,
      contactPersonNumber,
      rating,
    });

    res.status(201).json(newHotel);
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate("state", "state country type")  // Working now
      .populate("destination", "destinationName type country state");

    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ------------------- GET HOTEL BY ID -------------------
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("state", "state country type")
      .populate("destination", "destinationName type country state");

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ------------------- UPDATE HOTEL -------------------
export const updateHotel = async (req, res) => {
  try {
    const updated = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ------------------- DELETE HOTEL -------------------
export const deleteHotel = async (req, res) => {
  try {
    const deleted = await Hotel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
