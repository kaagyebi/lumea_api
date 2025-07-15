import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

let storage = null;
let profileStorage = null;
let certificateStorage = null;

const getCloudinaryStorage = () => {
  if (!storage) {
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are required for image uploads');
    }
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'lumea_skin_reports', 
        allowed_formats: ['jpg', 'png', 'jpeg'], 
        
        public_id: (req, file) => {
          const userId = req.user ? req.user.id : 'unknown-user';
          return `report-${userId}-${Date.now()}`;
        },
      },
    });
  }
  return storage;
};

const getProfilePictureStorage = () => {
  if (!profileStorage) {
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are required for image uploads');
    }
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    profileStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'lumea_profile_pictures', 
        allowed_formats: ['jpg', 'png', 'jpeg'], 
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' }
        ],
        public_id: (req, file) => {
          const userId = req.user ? req.user.id : 'unknown-user';
          return `profile-${userId}-${Date.now()}`;
        },
      },
    });
  }
  return profileStorage;
};

const getCertificateStorage = () => {
  if (!certificateStorage) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are required for image uploads');
    }
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    certificateStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'lumea_certificates',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
        public_id: (req, file) => {
          const userId = req.user ? req.user.id : 'unknown-user';
          return `certificate-${userId}-${Date.now()}`;
        },
      },
    });
  }
  return certificateStorage;
};

export const upload = multer({ 
  storage: getCloudinaryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const uploadProfilePicture = multer({ 
  storage: getProfilePictureStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const uploadCertificate = multer({
  storage: getCertificateStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});
