import SkinReport from '../models/skin_report.js';
import { analyzeSkinImage } from '../services/ai_service.js';
import User from '../models/user.js';
import PDFDocument from 'pdfkit';

/**
 * @desc    Analyze an uploaded image, create a skin report, and save it
 * @route   POST /api/skin-reports
 * @access  Private
 */
export const analyzeAndSaveReport = async (req, res) => {
  try {
    // The image URL/path comes from the multer middleware
    const imageUrl = req.file?.path; 
    if (!imageUrl) return res.status(400).json({ message: 'Image is required' });

    const analysis = await analyzeSkinImage(imageUrl);

    const report = await SkinReport.create({
      user: req.user.id,
      imageUrl,
      analysis
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { skinReports: report.id } });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Get all skin reports for the currently logged-in user
 * @route   GET /api/skin-reports
 * @access  Private
 */
export const getMySkinReports = async (req, res) => {
  try {
    // req.user.id is populated by the 'protect' middleware
    const reports = await SkinReport.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Get a single skin report by its ID
 * @route   GET /api/skin-reports/:id
 * @access  Private
 */
export const getSkinReportById = async (req, res) => {
  try {
    const report = await SkinReport.findById(req.params.id).populate('user', 'name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Security Check: Ensure the user owns this report
    if (report.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to view this report' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Download a single skin report as a PDF
 * @route   GET /api/skin-reports/:id/download
 * @access  Private
 */
export const downloadSkinReport = async (req, res) => {
  try {
    const report = await SkinReport.findById(req.params.id).populate('user', 'name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Security Check: Ensure the user owns this report
    if (report.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to download this report' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `Lumea-Skin-Report-${report.id}.pdf`;

    // Set HTTP headers to trigger a file download in the browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // It's good practice to handle errors on the stream directly.
    // This catches issues that might occur during the PDF generation/streaming process.
    doc.on('error', (err) => {
      console.error('Error during PDF generation:', err);
      res.end(); // End the response if an error occurs
    });
    // Pipe the PDF document directly to the response
    doc.pipe(res);

    // --- Add Content to the PDF ---
    doc.fontSize(24).font('Helvetica-Bold').text('Lumea Skin Analysis Report', { align: 'center' });
    doc.moveDown(2);
    doc.text('User: ', { continued: true }).font('Helvetica').text(report.user.name);
    doc.font('Helvetica-Bold').text('Date: ', { continued: true }).font('Helvetica').text(new Date(report.createdAt).toLocaleDateString());
    doc.moveDown(2);

    doc.fontSize(18).font('Helvetica-Bold').text('Comprehensive Analysis', { underline: true });
    doc.moveDown();

    const { tone, skinType, skinAge, skinHealth, texture, oilLevel, poreVisibility, conditions, precautions } = report.analysis || {};

    // --- Detailed Analysis Section ---
    doc.fontSize(12).font('Helvetica-Bold').text('Skin Tone: ', { continued: true }).font('Helvetica').text(tone || 'N/A');
    doc.font('Helvetica-Bold').text('Skin Type: ', { continued: true }).font('Helvetica').text(skinType || 'N/A');
    doc.font('Helvetica-Bold').text('Estimated Skin Age: ', { continued: true }).font('Helvetica').text(skinAge ? `${skinAge} years` : 'N/A');
    doc.font('Helvetica-Bold').text('Overall Skin Health: ', { continued: true }).font('Helvetica').text(skinHealth || 'N/A');
    doc.font('Helvetica-Bold').text('Texture: ', { continued: true }).font('Helvetica').text(texture || 'N/A');
    doc.font('Helvetica-Bold').text('Oil Level: ', { continued: true }).font('Helvetica').text(oilLevel || 'N/A');
    doc.font('Helvetica-Bold').text('Pore Visibility: ', { continued: true }).font('Helvetica').text(poreVisibility || 'N/A');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Identified Conditions:');
    doc.fontSize(12).font('Helvetica').list(conditions && conditions.length ? conditions : ['None identified'], { bulletRadius: 2 });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Recommended Precautions:');
    doc.fontSize(12).font('Helvetica').list(precautions && precautions.length ? precautions : ['None'], { bulletRadius: 2 });
    doc.moveDown(2);

    doc.fontSize(18).font('Helvetica-Bold').text('Cosmetologist Notes', { underline: true });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(report.cosmetologistNotes || 'No notes provided.');

    // Finalize the PDF and end the response
    doc.end();
  } catch (err) {
    // This will catch errors that happen *before* the stream starts,
    // like the report not being found.
    console.error('Error preparing PDF download:', err);
    res.status(500).json({ error: err.message });
  }
};
