import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { 
  analyzeAndSaveReport, 
  getMySkinReports,
  getSkinReportById,
  downloadSkinReport,
  getSkinReportByUserId 
} from "../controllers/skinreport_controller.js";
import { upload } from "../middlewares/upload_middlewares.js";

export const skinReportRouter = Router();

// USER-ONLY: Upload and analyze a new skin image.
skinReportRouter.post('/', protect(['user']), upload.single('image'), analyzeAndSaveReport);

// USER-ONLY: Get all skin reports for the currently logged-in user.
skinReportRouter.get('/', protect(['user']), getMySkinReports);

// Get a specific skin report by ID. Accessible by the owner, an associated cosmetologist, or an admin.
// The controller handles the detailed authorization logic.
skinReportRouter.get('/:id', protect(['user', 'cosmetologist', 'admin']), getSkinReportById);

skinReportRouter.get('/user/:id', protect(['user', 'cosmetologist', 'admin']), getSkinReportByUserId);

// Download a specific skin report as a PDF. Same access rules as getting the report by ID.
skinReportRouter.get('/:id/download', protect(['user', 'cosmetologist', 'admin']), downloadSkinReport);
