import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { 
  analyzeAndSaveReport, 
  getMySkinReports,
  getSkinReportById,
  downloadSkinReport 
} from "../controllers/skinreport_controller.js";
import { upload } from "../middlewares/upload_middlewares.js";

export const skinReportRouter = Router();

// Upload and analyze skin image (main route)
skinReportRouter.post('/', protect(), upload.single('image'), analyzeAndSaveReport);

// Upload and analyze skin image (backward compatibility)
skinReportRouter.post('/upload', protect(), upload.single('image'), analyzeAndSaveReport);

// Get all skin reports for current user
skinReportRouter.get('/', protect(), getMySkinReports);

// Get specific skin report by ID
skinReportRouter.get('/:id', protect(), getSkinReportById);

// Download skin report as PDF
skinReportRouter.get('/:id/download', protect(), downloadSkinReport);
