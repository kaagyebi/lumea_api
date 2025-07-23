import Appointment from '../models/appointment.js';
import User from '../models/user.js';

export const bookAppointment = async (req, res) => {
  try {
    const { 
      cosmetologist, 
      date, 
      time, 
      skinType,  
      weight, 
      description,
      concern, 
      gender, 
      age 
    } = req.body;
    
    const appointment = await Appointment.create({
      user: req.user.id,
      cosmetologist,
      date,
      time,
      skinType,
      weight,
      description,
      concern,
      gender,
      age,
      status: 'pending'
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { appointments: appointment._id } });
    await User.findByIdAndUpdate(cosmetologist, { $push: { appointments: appointment._id } });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user.id };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('cosmetologist', 'name email profile')
      .sort({ date: 1 });
    
    console.log(`Found ${appointments.length} appointments for user ${req.user.id}`);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCosmetologistAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { cosmetologist: req.user.id };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    console.log(`Searching for appointments with query:`, query);
    
    const appointments = await Appointment.find(query)
      .populate('user', 'name email profile')
      .sort({ date: 1 });
    
    console.log(`Found ${appointments.length} appointments for cosmetologist ${req.user.id}`);
    
    res.json(appointments);
  } catch (err) {
    console.error('Error in getCosmetologistAppointments:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { status, role } = req.query;
    let query = {};
    
    // Filter by role
    if (role === 'cosmetologist') {
      query.cosmetologist = req.user.id;
    } else {
      query.user = req.user.id;
    }
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('user', 'name email profile')
      .populate('cosmetologist', 'name email profile')
      .sort({ date: 1 });
    
    res.json({
      count: appointments.length,
      appointments: appointments,
      query: query,
      userRole: req.user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user has permission to update this appointment
    const isOwner = appointment.user.toString() === req.user.id;
    const isCosmetologist = appointment.cosmetologist.toString() === req.user.id;
    
    if (!isOwner && !isCosmetologist) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    // Only cosmetologists can accept/reject appointments
    if (status === 'accepted' || status === 'rejected') {
      if (!isCosmetologist) {
        return res.status(403).json({ message: 'Only cosmetologists can accept or reject appointments' });
      }
    }
    
    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('user', 'name email profile').populate('cosmetologist', 'name email profile');
    
    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
