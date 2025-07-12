import User from '../models/user.js';
import Appointment from '../models/appointment.js';
import SkinReport from '../models/skin_report.js';

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
