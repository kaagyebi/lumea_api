import express from 'express';
import {
    analyzeAndSaveReport,
    getMySkinReports,
    getSkinReportById,
    downloadSkinReport
} from '../controllers/skinreport_controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload_middlewares.js';

const router = express.Router();

router
    .route('/')
    .post(protect(['user']), upload.single('image'), analyzeAndSaveReport)
    .get(protect(['user']), getMySkinReports);

// Route for getting a single report's data as JSON
router.route('/:id').get(protect(['user']), getSkinReportById);

// Route for downloading the report as a PDF
router.route('/:id/download').get(protect(['user']), downloadSkinReport);

export default router;