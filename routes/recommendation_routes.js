import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { 
  getUserRecommendations, 
  createRecommendation, 
  getCosmetologistRecommendations 
} from "../controllers/recommendation_controller.js";

export const recommendationRouter = Router();

// POST / - Create a new recommendation for a user. (Cosmetologist only)
// The user ID to recommend for should be in the request body.
recommendationRouter.post("/", protect(['cosmetologist']), createRecommendation);

// GET /cosmetologist - Get all recommendations made by the logged-in cosmetologist.
recommendationRouter.get("/cosmetologist", protect(['cosmetologist']), getCosmetologistRecommendations);

// GET /user/:userId - Get all recommendations for a specific user.
// A regular user can use this for their own ID, or a cosmetologist can check a client's.
recommendationRouter.get("/user/:userId", protect(['user', 'cosmetologist', 'admin']), getUserRecommendations);