// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARYAPIKEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;




import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARYAPIKEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_SECRET,
} = process.env;

const cloudName = CLOUDINARY_CLOUD_NAME || CLOUDINARY_NAME;
const apiKey = CLOUDINARY_API_KEY || CLOUDINARYAPIKEY;
const apiSecret = CLOUDINARY_API_SECRET || CLOUDINARY_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Cloudinary configuration missing. Ensure cloud name, api key, and api secret are set in .env (supports CLOUDINARY_CLOUD_NAME|CLOUDINARY_NAME, CLOUDINARY_API_KEY|CLOUDINARYAPIKEY, CLOUDINARY_API_SECRET|CLOUDINARY_SECRET)."
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;