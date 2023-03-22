import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const cloudinaryInst = cloudinary.v2;

cloudinaryInst.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_SECRET,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInst,
  params: {
    folder: "capulus",
    format: "png",
    use_filename: true,
  },
});

const uploadImg = multer({ storage: storage });

export { uploadImg };
