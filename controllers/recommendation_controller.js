import Recommendation from '../models/recommendation.js';
import SkinReport from '../models/skin_report.js';

export const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req;

    // Check permissions: user can access their own recommendations, admins can access any
    if (user.role !== 'admin' && user.id !== userId) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only access your own recommendations' 
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
