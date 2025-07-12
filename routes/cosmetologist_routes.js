import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { updateAvailability, getAppointments, addConsultationNotes } from "../controllers/cosmetologist_controller.js";


export const cosmetologistRouter = Router();

cosmetologistRouter.patch('/availability',  protect(['cosmetologist']), updateAvailability);
cosmetologistRouter.get('/appointments',  protect(['cosmetologist']), getAppointments);
cosmetologistRouter.post('/notes/:userId', protect(['cosmetologist']), addConsultationNotes);