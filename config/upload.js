// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "./cloudinary.js"; // import the cloudinary config

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "expenses",        // optional folder in Cloudinary
//     allowed_formats: ["jpg", "jpeg", "png", "pdf"], 
//   },
// });

// const upload = multer({ storage });

// export default upload;




import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // import the cloudinary config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "expenses",        // optional folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

export default upload;