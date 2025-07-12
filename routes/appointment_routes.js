import { Router } from "express";   
import { protect } from "../middlewares/auth.js";
import { 
  bookAppointment, 
  getUserAppointments, 
  getCosmetologistAppointments,
  updateAppointmentStatus,
  getAllAppointments
} from "../controllers/appointment_controller.js";

export const appointmentRouter = Router();

// Book a new appointment
appointmentRouter.post("/", protect(), bookAppointment);

// Get appointments for current user (works for both users and cosmetologists)
appointmentRouter.get("/", protect(), getUserAppointments);

// Get appointments for cosmetologist (with status filtering)
appointmentRouter.get("/cosmetologist", protect(['cosmetologist']), getCosmetologistAppointments);

// Debug endpoint to see all appointments with details
appointmentRouter.get("/debug", protect(), getAllAppointments);

// Update appointment status
appointmentRouter.patch("/:id", protect(), updateAppointmentStatus);