import User from '../models/user.js';
import SkinReport from '../models/skin_report.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSkinHistory = async (req, res) => {
  try {
    const history = await SkinReport.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCosmetologists = async (req, res) => {
  try {
    const { role } = req.query;
    
    // If role query parameter is provided, filter by role
    if (role === 'cosmetologist') {
      const cosmetologists = await User.find({ role: 'cosmetologist' })
        .select('name email profile')
        .sort({ name: 1 });
      return res.json(cosmetologists);
    }
    
    // Otherwise return all users (excluding passwords)
    const users = await User.find().select('-password').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { bio, specialization, availability, image } = req.body;
    
    const updateData = {};
    if (bio !== undefined) updateData['profile.bio'] = bio;
    if (specialization !== undefined) updateData['profile.specialization'] = specialization;
    if (availability !== undefined) updateData['profile.availability'] = availability;
    if (image !== undefined) updateData['profile.image'] = image;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    // Get the Cloudinary URL from the uploaded file
    const imageUrl = req.file.path;

    // Update user's profile with the new image URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'profile.image': imageUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      imageUrl: imageUrl,
      user: user
    });
  } catch (err) {
    console.error('Profile picture upload error:', err);
    res.status(500).json({ error: err.message });
  }
};
