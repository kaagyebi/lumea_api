import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { updateAvailability, getAppointments, addConsultationNotes } from "../controllers/cosmetologist_controller.js";
import { uploadProfilePicture, uploadCertificate } from "../middlewares/upload_middlewares.js";
import multer from 'multer';
import { registerCosmetologist } from "../controllers/cosmetologist_controller.js";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const cosmetologistStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'picture') {
      return {
        folder: 'lumea_profile_pictures',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
        public_id: `profile-${Date.now()}`
      };
    }
    if (file.fieldname === 'certificate') {
      return {
        folder: 'lumea_certificates',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
        public_id: `certificate-${Date.now()}`
      };
    }
    throw new Error(`Unexpected field: ${file.fieldname}`);
  }
});

const uploadCosmetologist = multer({ storage: cosmetologistStorage });

export const cosmetologistRouter = Router();

cosmetologistRouter.patch('/availability',  protect(['cosmetologist']), updateAvailability);
cosmetologistRouter.get('/appointments',  protect(['cosmetologist']), getAppointments);
cosmetologistRouter.post('/notes/:userId', protect(['cosmetologist']), addConsultationNotes);
cosmetologistRouter.post(
  '/register',
  uploadCosmetologist.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
  ]),
  registerCosmetologist
);