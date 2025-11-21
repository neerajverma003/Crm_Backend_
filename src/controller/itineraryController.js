import Itinerary from "../models/ItineraryModel.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

// Helper function to upload buffer to Cloudinary
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "itineraries" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ================= CREATE ITINERARY (multiple PDFs) =================
export const createItinerary = async (req, res) => {
  try {
    const { Destination, NoOfDay } = req.body;

    if (!Destination || !NoOfDay || !req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Destination, NoOfDay, and at least one PDF are required",
      });
    }

    // Upload all files to Cloudinary
    const uploadedUrls = [];
    for (const file of req.files) {
      const result = await streamUpload(file.buffer);
      uploadedUrls.push(result.secure_url);
    }

    const newItinerary = await Itinerary.create({
      Destination,
      NoOfDay,
      Upload: uploadedUrls, // array of URLs
    });

    return res.status(201).json({
      success: true,
      message: "Itinerary created successfully",
      data: newItinerary,
    });
  } catch (error) {
    console.error("Create Itinerary Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= GET ALL ITINERARIES =================
export const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json({ success: true, data: itineraries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= GET ITINERARY BY ID =================
export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: itinerary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= UPDATE ITINERARY =================
export const updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: itinerary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= DELETE ITINERARY =================
export const deleteItinerary = async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
