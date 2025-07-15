import User from '../models/user.js';
import Appointment from '../models/appointment.js';
import SkinReport from '../models/skin_report.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const updateAvailability = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      'profile.availability': req.body.availability
    }, { new: true });

    res.json(user.profile.availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addConsultationNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes, reportId } = req.body;

    const report = await SkinReport.findOneAndUpdate(
      { _id: reportId, user: userId },
      { cosmetologistNotes: notes },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found for this user.' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ cosmetologist: req.user.id }).sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerCosmetologist = async (req, res) => {
  try {
    console.log('FILES:', req.files);
    console.log('BODY:', req.body);
    const { name, email, password, areaOfExpertise } = req.body;
    if (!req.files || !req.files.picture || !req.files.certificate) {
      return res.status(400).json({ message: 'Picture and certificate are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const pictureUrl = req.files.picture[0].path;
    const certificateUrl = req.files.certificate[0].path;
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: 'cosmetologist',
      areaOfExpertise,
      certificate: certificateUrl,
      profile: {
        image: pictureUrl,
        areaOfExpertise,
        certificate: certificateUrl,
      },
    });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
