import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const requiredCloudinaryVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVars = requiredCloudinaryVars.filter(
  (variableName) => !process.env[variableName]
);

let cloudinaryEnabled = missingVars.length === 0;
let cloudinaryStorage = null;

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: "cuet-lost-found/items",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      resource_type: "image",
    }),
  });
} else {
  console.warn(
    `[Cloudinary] Missing env vars: ${missingVars.join(", ")}. Cloud uploads are disabled until env vars are available.`
  );
}

export { cloudinaryStorage, cloudinaryEnabled };
export default cloudinary;
