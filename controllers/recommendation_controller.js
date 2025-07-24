import Recommendation from '../models/recommendation.js';
import SkinReport from '../models/skin_report.js';
import Appointment from '../models/appointment.js';

export const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const requester = req.user;

    // Security Check:
    // 1. The user who owns the recommendations can view them.
    const isOwner = userId === requester.id;
    // 2. An admin can view any recommendations.
    const isAdmin = requester.role === 'admin';
    // 3. A cosmetologist can view recommendations if they have an appointment with the user.
    let isAssociatedCosmetologist = false;
    if (requester.role === 'cosmetologist') {
      const appointment = await Appointment.findOne({
        user: userId,
        cosmetologist: requester.id,
      });
      if (appointment) {
        isAssociatedCosmetologist = true;
      }
    }

    if (!isOwner && !isAdmin && !isAssociatedCosmetologist) {
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to view these recommendations'
      });
    }

    const recommendations = await Recommendation.find({ user: userId })
      .populate('generatedBy', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(recommendations);
  } catch (err) {
    console.error('Error in getUserRecommendations:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getCosmetologistRecommendations = async (req, res) => {
  try {
    const { user } = req;

    // Only cosmetologists and admins can access this
    if (user.role !== 'cosmetologist' && user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Forbidden: Only cosmetologists can access this endpoint' 
      });
    }

    const recommendations = await Recommendation.find({ generatedBy: user.id })
      .populate('user', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(recommendations);
  } catch (err) {
    console.error('Error in getCosmetologistRecommendations:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createRecommendation = async (req, res) => {
  try {
    const { userId, products, routines, notes, reportId } = req.body;
    const { user } = req;

    // Only cosmetologists and admins can create recommendations
    if (user.role !== 'cosmetologist' && user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Forbidden: Only cosmetologists can create recommendations' 
      });
    }

    const recommendation = await Recommendation.create({
      user: userId,
      products: products || [],
      routines: routines || [],
      notes: notes || '',
      generatedBy: user.id
    });

    if (reportId) {
      await SkinReport.findByIdAndUpdate(reportId, {
        $push: { recommendations: recommendation._id }
      });
    }

    // Populate the user info before sending response
    const populatedRecommendation = await Recommendation.findById(recommendation._id)
      .populate('user', 'name email profilePicture');

    res.status(201).json(populatedRecommendation);
  } catch (err) {
    console.error('Error in createRecommendation:', err);
    res.status(500).json({ error: err.message });
  }
};
