import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // make sure to include .js for ES modules

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bills", // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const upload = multer({ storage });

export default upload;
