import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // make sure this exists

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "tutorials",
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "pdf", "ppt", "pptx"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Multer upload middleware
const upload = multer({ storage });

export default upload;
